export type Thread = {
    id: string;
    content: string;
    title: string;
    imageUrl: string;
    timestamp: number;
    lastInteraction: number;
    userIsAuthor: boolean;
    replies: Reply[];
    taggedElementIds: string[];
    taggedByElementIds: string[];
    replyCount: number;
}

export interface Reply {
    id: string;
    content: string;
    timestamp: number;
    userIsAuthor: boolean;
    taggedElementIds: string[];
    taggedByElementIds: string[];
    imageUrl: string;
}