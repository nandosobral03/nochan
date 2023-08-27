import { Elysia, t } from "elysia";
import { createThread } from "../controllers/threads.controller";
import { CreateThreadModel, CreateThreadModelDTO } from "../models/thread.model"
const router = new Elysia()


router.post("/", ({ body, headers }) => createThread({ body, headers }), {
    body: CreateThreadModelDTO
})

export default router;
