import { CreateReplyModel, CreateThreadModel, ThreadModel, ReplyModel, GetThreadModel, GetReplyModel } from "../models/thread.model";
import { getThreadCollection, getDb, getReplyCollection, getImageCollection, getUtilsCollection } from "../utils/db";
import { getCurrentId } from "../utils/currentId";
import { HTTPError, MapToHTTPError } from "../utils/error";
import { removeHangingImages } from "../utils/images";
import { getCurrentHash } from "./state.service";

export const createThread = async (t: CreateThreadModel, userId: string): Promise<string> => {
    try {
        const imageCollection = await getImageCollection();
        let imageUrl = "";
        if (t.imageId) {
            const image = await imageCollection.findOne({ id: t.imageId, associatedElement: "" });
            if (!image) {
                throw HTTPError(404, "Image not found");
            }
            imageUrl = image.url;
        }
        const collection = await getThreadCollection();
        const currentId = await getCurrentId();
        let timestamp = Date.now();
        const thread: ThreadModel = {
            ...t,
            imageUrl,
            userId: userId,
            id: currentId,
            timestamp,
            lastInteraction: timestamp,
            taggedByElementIds: [],
            taggedElementIds: t.taggedElementIds ?? []
        }

        await collection.insertOne(thread);
        await imageCollection.updateOne({ id: t.imageId }, { $set: { associatedElement: thread.id } });
        await addTaggedElementId(thread.id, thread.taggedElementIds);
        return thread.id;
    }
    catch (e) {
        console.log(e);
        throw MapToHTTPError(e);
    }
}

export const addTaggedElementId = async (taggerId: string, taggedElements: string[]) => {
    for (let tagged of taggedElements) {
        try {
            let replyCollection = await getReplyCollection();
            if (await replyCollection.findOne({ id: tagged })) {
                await replyCollection.updateOne({ id: tagged }, { $push: { taggedByElementIds: taggerId } });
            }
            else {
                let threadCollection = await getThreadCollection();
                if (await threadCollection.findOne({ id: tagged })) {
                    await threadCollection.updateOne({ id: tagged }, { $push: { taggedByElementIds: taggerId } });
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

const createGetThreadModel = (thread: ThreadModel, replies: ReplyModel[], userId?: string): GetThreadModel => {
    const response: GetThreadModel = {
        id: thread.id,
        content: thread.content,
        title: thread.title,
        imageUrl: thread.imageUrl,
        timestamp: thread.timestamp,
        lastInteraction: thread.lastInteraction,
        userIsAuthor: userId !== undefined && userId === thread.userId,
        replies: replies.map(r => createGetRepliesModel(r, userId)),
        taggedElementIds: thread.taggedElementIds,
        taggedByElementIds: thread.taggedByElementIds
    }
    return response;
}


const createGetRepliesModel = (reply: ReplyModel, userId?: string): GetReplyModel => {
    const response: GetReplyModel = {
        id: reply.id,
        content: reply.content,
        timestamp: reply.timestamp,
        userIsAuthor: userId !== undefined && userId === reply.userId,
        taggedElementIds: reply.taggedElementIds,
        taggedByElementIds: reply.taggedByElementIds,
        imageUrl: reply.imageUrl
    }
    return response;
}

export const getThread = async (id: string, userId?: string): Promise<GetThreadModel> => {
    const collection = await getThreadCollection();
    const replyCollection = await getReplyCollection();
    let thread = await collection.findOne({ id }, { projection: { _id: 0 } });
    if (!thread) {
        throw HTTPError(404, "Thread not found");
    }
    let replies = await replyCollection.find({ threadId: id }, { projection: { _id: 0 } }).toArray();
    return createGetThreadModel(thread, replies, userId);
}

export const createReply = async (threadId: string, r: CreateReplyModel, userId: string): Promise<string> => {
    try {
        const imageCollection = await getImageCollection();
        let imageUrl = "";
        if (r.imageId) {
            const image = await imageCollection.findOne({ id: r.imageId, associatedElement: "" });
            if (!image) {
                throw HTTPError(404, "Image not found");
            }
            imageUrl = image.url;
        }
        await getThread(threadId); // check if thread exists, method throws error if it doesn't
        const currentId = await getCurrentId();
        const collection = await getReplyCollection();
        const timestamp = Date.now();
        const reply: ReplyModel = {
            ...r,
            userId: userId,
            imageUrl,
            threadId,
            id: currentId,
            timestamp,
            taggedByElementIds: [],
            taggedElementIds: r.taggedElementIds ?? []
        }
        await (await getThreadCollection()).updateOne({ id: threadId }, { $set: { lastInteraction: timestamp } });
        await imageCollection.updateOne({ id: r.imageId }, { $set: { associatedElement: reply.id } });
        await collection.insertOne(reply);
        await addTaggedElementId(reply.id, reply.taggedElementIds);
        return reply.id;
    } catch (e) {
        console.log(e);
        throw MapToHTTPError(e);
    }
}



export const removeOldThreads = async () => {
    const currentTimestamp = Date.now();
    const timestamp = currentTimestamp - 1000 * 60 * 60 * 24; // 24 hours ago
    const collection = await getThreadCollection();
    const replyCollection = await getReplyCollection();
    let deletedIds: string[] = []
    const threads = await collection.find({ timestamp: { $lt: timestamp } }).toArray();
    let highestId = threads.reduce((prev, curr) => parseInt(curr.id) > prev ? parseInt(curr.id) : prev, 0);
    deletedIds.push(...threads.map(t => t.id));
    for (let thread of threads) {
        let replies = await replyCollection.find({ threadId: thread.id }).toArray()
        highestId = replies.reduce((prev, curr) => parseInt(curr.id) > prev ? parseInt(curr.id) : prev, highestId);
        deletedIds.push(...replies.map(r => r.id));
        await replyCollection.deleteMany({ threadId: thread.id });
    }
    await collection.deleteMany({ timestamp: { $lt: timestamp } });
    const imageCollection = await getImageCollection();
    await imageCollection.updateMany({ associatedElement: { $in: deletedIds } }, { $set: { associatedElement: "" } });
    const utils = await getUtilsCollection();

    let current = await utils.findOne({ id: "current" })
    utils.updateOne({ id: "lastUpdated" }, { $set: { value: currentTimestamp.toString() } }, { upsert: true });
    utils.updateOne({ id: "hash" }, { $set: { value: await getCurrentHash(currentTimestamp) } }, { upsert: true })
}



export default { createThread, getThread, createReply };