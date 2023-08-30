import proquint from "proquint";
import { CreateReplyModel, CreateThreadModel, GetThreadModel } from "../models/thread.model"
import threadsService from "../services/threads.service"
import { saveImage } from "../utils/images"
import { MySortDirection, SortBy } from "../routes/threads.routes";
import { HTTPError } from "../utils/error";

const generateUserId = (): string => {
    var id: Buffer = Buffer.from(crypto.getRandomValues(new Uint8Array(4)));
    var encoded = proquint.encode(id);
    return encoded;
}


export const createThread = async ({ body, headers }: { body: CreateThreadModel, headers: Record<string, string | null> }): Promise<{ threadId: string }> => {
    const userId = headers["user-id"] ?? generateUserId()
    const id = await threadsService.createThread(body, userId);
    return {
        threadId: id
    }
}

export const uploadImageToServer = async (file: Blob): Promise<{ imageUrl: string }> => {
    let fileContents = await file.text();
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(fileContents);
    hasher.update(Date.now().toString());
    const hash = hasher.digest("hex");
    const imageUrl = await saveImage(file, hash);
    return { imageUrl };
}


export const createReply = async ({ body, headers, params }: { body: CreateReplyModel, headers: Record<string, string | null>, params: { threadId: string } }): Promise<{ replyId: string }> => {
    const userId = headers["user-id"] ?? generateUserId()
    const id = await threadsService.createReply(params.threadId, body, userId);
    return {
        replyId: id
    }
}

export const getThread = async ({ params, headers }: { params: { threadId: string }, headers: Record<string, string | null> }): Promise<GetThreadModel> => {
    const userId = headers["user-id"] || undefined;
    const thread = await threadsService.getThread(params.threadId, userId);
    return thread;
}

export const getThreads = async ({ query, headers }: { query: Record<string, string>, headers: Record<string, string | null> }): Promise<{ threads: GetThreadModel[], total: number }> => {
    const userId = headers["user-id"] || undefined;
    if (!["asc", "desc"].includes(query.order)) throw HTTPError(400, "Invalid order parameter, possible values are asc, desc");
    if (!["timestamp", "replyCount", "lastInteraction"].includes(query.orderBy)) throw HTTPError(400, "Invalid orderBy parameter, possible values are timestamp, replyCount, lastInteraction");
    let page = 0;
    let pageSize = 10;
    try {
        page = parseInt(query.page);
    }
    catch {
        console.log("Invalid page parameter, defaulting to 0");
    }
    try {
        pageSize = parseInt(query.pageSize);
    }
    catch {
        console.log("Invalid pageSize parameter, defaulting to 10");
    }
    let sortBy = SortBy.timestamp;
    switch (query.orderBy) {
        case "replyCount":
            sortBy = SortBy.replyCount;
            break;
        case "lastInteraction":
            sortBy = SortBy.lastInteraction;
            break;
        default:
            sortBy = SortBy.timestamp;
    }




    const threads = await threadsService.getThreads(page, pageSize, sortBy, query.order == "asc" ? MySortDirection.asc : MySortDirection.desc, userId);
    return threads;
}