import { t } from "elysia"
import { Static } from '@sinclair/typebox'
// Create
export const CreateThreadModelDTO = t.Object({
    title: t.String(),
    author: t.Optional(t.String()),
    content: t.String(),
    taggedElementIds: t.Optional(t.Array(t.String())),
    imageId: t.Optional(t.String()),
})
export type CreateThreadModel = Static<typeof CreateThreadModelDTO>

export const CreateReplyModelDTO = t.Object({
    content: t.String(),
    author: t.Optional(t.String()),
    imageId: t.Optional(t.String()),
    taggedElementIds: t.Optional(t.Array(t.String())),
})
export type CreateReplyModel = Static<typeof CreateReplyModelDTO>



// Get
export type GetThreadModel = {
    id: string
    author: string
    content: string
    title: string
    image?: GetImageModel
    timestamp: number
    lastInteraction: number
    userIsAuthor: boolean
    replies: GetReplyModel[]
    taggedElementIds: string[]
    taggedByElementIds: string[]
    replyCount: number
}

export type GetReplyModel = {
    id: string
    content: string
    image?: GetImageModel
    timestamp: number
    userIsAuthor: boolean
    taggedElementIds: string[]
    taggedByElementIds: string[]
}


export type GetImageModel = {
    id: string
    url: string
    dimensions: string
    size: number
}



// Database model
export type ThreadModel = {
    id: string,
    author: string,
    title: string,
    content: string,
    userId: string,
    imageId?: string,
    timestamp: number,
    lastInteraction: number,
    taggedElementIds: string[],
    taggedByElementIds: string[]
    replyCount: number
}


export type ReplyModel = {
    id: string,
    author: string,
    threadId: string,
    content: string,
    userId: string,
    imageId?: string,
    timestamp: number,
    taggedElementIds: string[],
    taggedByElementIds: string[]
}
