import { t } from "elysia"
import { Static } from '@sinclair/typebox'
// Create
export const CreateThreadModelDTO = t.Object({
    title: t.String(),
    content: t.String(),
    userId: t.String(),
    imageUrl: t.Optional(t.String()),
    taggedElementIds: t.Optional(t.Array(t.String())),
})
export type CreateThreadModel = Static<typeof CreateThreadModelDTO>

export const CreateReplyModelDTO = t.Object({
    threadId: t.String(),
    content: t.String(),
    userId: t.String(),
    imageUrl: t.Optional(t.String()),
    taggedElementIds: t.Optional(t.Array(t.String())),
})
export type CreateReplyModel = Static<typeof CreateReplyModelDTO>



// Get
export type GetThreadModel = {
    threadId: string
    content: string
    title: string
    imageUrl: string | null
    timestamp: Date
    lastInteraction: Date
    userIsAuthor: boolean
    comment: GetReplyModel[],
    taggedElementIds: string[],
    taggedByElementIds: string[]
}

export type GetReplyModel = {
    replyId: string
    content: string
    imageUrl: string | null
    timestamp: Date
    userIsAuthor: boolean,
    taggedElementIds: string[],
    taggedByElementIds: string[]
}



// Database model
export type ThreadModel = {
    id: string,
    title: string,
    content: string,
    userId: string,
    imageUrl?: string,
    replies: ReplyModel[],
    timestamp: number,
    lastInteraction: number,
    taggedElementIds: string[],
    taggedByElementIds: string[]
}


export type ReplyModel = {
    id: string,
    content: string,
    userId: string,
    imageUrl?: string,
    timestamp: number,
    taggedElementIds: string[],
    taggedByElementIds: string[]
}
