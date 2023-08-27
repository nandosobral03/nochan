import { CreateThreadModel, ThreadModel } from "../models/thread.model";
import { getClient, getDb } from "../utils/db";
import { HTTPError, MapToHTTPError } from "../utils/error";
export const createThread = async (t: CreateThreadModel): Promise<string> => {
    const client = await getClient();
    const session = client.startSession();
    try {
        const db = await getDb();
        const { numberField } = (await db.collection("utils").findOneAndUpdate({ id: "current" }, { $inc: { numberField: 1 } }, { session, upsert: true })).value ?? { numberField: 0 };
        const thread: ThreadModel = {
            ...t,
            id: numberField,
            replies: [],
            timestamp: Date.now(),
            lastInteraction: Date.now(),
            taggedElementIds: [],
            taggedByElementIds: []
        }
        await db.collection("threads").insertOne(thread, { session });
        return thread.id;
    }
    catch (e) {
        console.log(e);
        throw MapToHTTPError(e);
    }
    finally {
        session.endSession();
    }
}

export const getThread = async (id: string): Promise<ThreadModel> => {
    const db = await getDb();
    let thread = await db.collection("threads").findOne({ id });
    if (!thread) {
        throw HTTPError(404, "Thread not found");
    }
    return thread.value;
}


export default { createThread };