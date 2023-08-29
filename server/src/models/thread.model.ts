import { t } from "elysia"
import { Static } from '@sinclair/typebox'
// Create
export const CreateThreadModelDTO = t.Object({
    title: t.String(),
    content: t.String(),
    taggedElementIds: t.Optional(t.Array(t.String())),
    imageId: t.Optional(t.String()),
})
export type CreateThreadModel = Static<typeof CreateThreadModelDTO>

export const CreateReplyModelDTO = t.Object({
    content: t.String(),
    imageId: t.Optional(t.String()),
    taggedElementIds: t.Optional(t.Array(t.String())),
})
export type CreateReplyModel = Static<typeof CreateReplyModelDTO>



// Get
export type GetThreadModel = {
    id: string
    content: string
    title: string
    imageUrl?: string
    timestamp: number
    lastInteraction: number
    userIsAuthor: boolean
    replies: GetReplyModel[]
    taggedElementIds: string[]
    taggedByElementIds: string[]
}

export type GetReplyModel = {
    id: string
    content: string
    imageUrl?: string
    timestamp: number
    userIsAuthor: boolean
    taggedElementIds: string[]
    taggedByElementIds: string[]
}



// Database model
export type ThreadModel = {
    id: string,
    title: string,
    content: string,
    userId: string,
    imageUrl?: string,
    timestamp: number,
    lastInteraction: number,
    taggedElementIds: string[],
    taggedByElementIds: string[]
}


export type ReplyModel = {
    id: string,
    threadId: string,
    content: string,
    userId: string,
    imageUrl?: string,
    timestamp: number,
    taggedElementIds: string[],
    taggedByElementIds: string[]
}
