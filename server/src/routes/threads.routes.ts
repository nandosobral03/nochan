import { Elysia, t } from "elysia";
import { createReply, createThread, getThread, getThreads } from "../controllers/threads.controller";
import { CreateReplyModelDTO, CreateThreadModelDTO } from "../models/thread.model"
const router = new Elysia()


router.post("/", ({ body, headers }) => createThread({ body, headers }), {
    body: CreateThreadModelDTO,
})
router.post("/:threadId", ({ body, headers, params }) => createReply({ body, headers, params }), {
    body: CreateReplyModelDTO
})
router.get("/:threadId", ({ params, headers, set }) => getThread({ params, headers, set }))

export enum SortBy {
    "timestamp",
    "replyCount",
    "lastInteraction"
}

export enum MySortDirection {
    "asc",
    "desc"
}


router.get("/", ({ query, headers }) => getThreads({ query, headers }), {
    query: t.Object({
        page: t.Optional(t.String()),
        pageSize: t.Optional(t.String()),
        orderBy: t.Optional(t.String()),
        order: t.Optional(t.String()),
    })
})



export default router;
