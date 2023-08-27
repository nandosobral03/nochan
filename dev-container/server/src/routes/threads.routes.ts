import { Elysia, t } from "elysia";
import { createReply, createThread, getThread } from "../controllers/threads.controller";
import { CreateReplyModelDTO, CreateThreadModelDTO } from "../models/thread.model"
const router = new Elysia()


router.post("/", ({ body, headers }) => createThread({ body, headers }), {
    body: CreateThreadModelDTO,
})
router.post("/:threadId", ({ body, headers, params }) => createReply({ body, headers, params }), {
    body: CreateReplyModelDTO
})
router.get("/:threadId", ({ params, headers }) => getThread({ params, headers }))


export default router;
