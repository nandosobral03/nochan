export type Thread = {
    id: string;
    author: string;
    content: string;
    title: string;
    image?: ImageModel;
    timestamp: number;
    lastInteraction: number;
    userIsAuthor: boolean;
    replies: Reply[];
    taggedElementIds: { id: string, userIsAuthor?: true }[],
    taggedByElementIds: string[];
    replyCount: number;
}

export type ThreadPreviewModel = Thread & { replyCount: number }


export type Reply = {
    id: string;
    author: string;
    content: string;
    timestamp: number;
    userIsAuthor: boolean;
    taggedElementIds: { id: string, userIsAuthor?: true }[],
    taggedByElementIds: string[];
    image?: ImageModel
}

export type ImageModel = {
    id: string
    url: string
    dimensions: string
    size: number
}

export type CreateThreadRequestModel = {
    title: string,
    author?: string,
    content: string,
    taggedElementIds: string[],
    imageId?: string,
    captchaToken: string
}