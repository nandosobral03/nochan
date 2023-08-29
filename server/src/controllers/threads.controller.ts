import proquint from "proquint";
import { CreateReplyModel, CreateThreadModel, GetThreadModel } from "../models/thread.model"
import threadsService from "../services/threads.service"
import { saveImage } from "../utils/images"

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