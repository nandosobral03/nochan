
export type CreateReplyRequestModel = {
    author?: string,
    content: string,
    taggedElementIds: string[],
    imageId?: string,
    captchaToken: string
}
