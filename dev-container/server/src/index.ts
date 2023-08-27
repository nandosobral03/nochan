import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'
import { cron } from '@elysiajs/cron'
import threadRoutes from "./routes/threads.routes";
import { removeOldThreads } from "./services/threads.service";
import { removeHangingImages } from "./utils/images";
import { uploadImageToServer } from "./controllers/threads.controller";


const app = new Elysia()
app.use(cors())
app.post('/images', ({ body: { file } }) => uploadImageToServer(file), {
  body: t.Object({
    file: t.File()
  })
})
app.group("/threads", app => app.use(threadRoutes))
app.listen(3000)
app.use(cron({
  name: 'cleanup',
  pattern: '* * * * *',
  run() {
    removeOldThreads();
    removeHangingImages();
  }
}))


// print all environment variables
console.log(process.env);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
