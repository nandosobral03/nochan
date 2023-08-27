import { CreateThreadModel } from "../models/thread.model"
import threadsService from "../services/threads.service"
export const createThread = async ({ body, headers }: { body: CreateThreadModel, headers: Record<string, string | null> }): Promise<{ threadId: string }> => {
    const id = await threadsService.createThread(body);
    return {
        threadId: id
    }
}