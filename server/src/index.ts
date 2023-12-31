import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'
import { cron } from '@elysiajs/cron'
import threadRoutes from "./routes/threads.routes";
import stateRoutes from "./routes/state.routes";
import { removeOldThreads } from "./services/threads.service";
import { removeHangingImages } from "./utils/images";
import { uploadImageToServer } from "./controllers/threads.controller";
import { createDailyThread } from "./services/threads.service";
import path from "path";
const dotenv = require('dotenv');
dotenv.config();
const app = new Elysia()
app.use(cors())
app.post('/images', ({ body: { file } }) => uploadImageToServer(file), {
  body: t.Object({
    file: t.File()
  })
})
app.get("/images/:id", ({ params: { id } }) => {
  return Bun.file(path.join(process.cwd(), "images", id))
})
app.group("/threads", app => app.use(threadRoutes))
app.group("/state", app => app.use(stateRoutes))
app.listen(process.env.PORT || 3000)
app.use(cron({
  name: 'cleanup',
  pattern: '* * * * *',
  run() {
    removeOldThreads().then(() => removeHangingImages());
  }
}))

app.use(cron({
  name: 'daily prompt',
  pattern: '0 0 * * *',
  run() {
    createDailyThread();
  }
}))

console.log(process.env)

try {
  createDailyThread();
  removeOldThreads().then(() => removeHangingImages()).catch(console.log)
}
catch (e: any) {
  console.log(e)
}
// print all environment variables
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
