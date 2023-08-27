import { Elysia } from "elysia";
import threadRoutes from "./routes/threads.routes";


const app = new Elysia()
app.group("/threads", app => app.use(threadRoutes))
app.listen(3000)



console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
