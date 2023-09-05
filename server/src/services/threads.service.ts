import { CreateReplyModel, CreateThreadModel, ThreadModel, ReplyModel, GetThreadModel, GetReplyModel, GetImageModel, GetThreadPreviewModel } from "../models/thread.model";
import { getThreadCollection, getReplyCollection, getImageCollection, getUtilsCollection } from "../utils/db";
import { getCurrentId } from "../utils/currentId";
import { HTTPError, MapToHTTPError } from "../utils/error";
import { getCurrentHash } from "./state.service";
import { SortBy, MySortDirection } from "../routes/threads.routes";


export const createThread = async (t: CreateThreadModel, userId: string): Promise<string> => {
    try {
        const imageCollection = await getImageCollection();
        const collection = await getThreadCollection();
        if (t.imageId) {
            const image = await imageCollection.findOne({ id: t.imageId, associatedElement: "" });
            if (!image) {
                throw HTTPError(404, "Image not found");
            }
        }
        const currentId = await getCurrentId();
        let timestamp = Date.now();
        const thread: ThreadModel = {
            ...t,
            author: t.author ?? "Anonymous",
            imageId: t.imageId,
            userId: userId,
            id: currentId,
            timestamp,
            lastInteraction: timestamp,
            taggedByElementIds: [],
            taggedElementIds: t.taggedElementIds ?? [],
            replyCount: 0
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

const createGetThreadModel = async (thread: ThreadModel, replies: ReplyModel[], userId?: string): Promise<GetThreadModel> => {
    const response: GetThreadModel = {
        id: thread.id,
        author: thread.author,
        content: thread.content,
        title: thread.title,
        image: await createGetImageModel(thread.imageId),
        timestamp: thread.timestamp,
        lastInteraction: thread.lastInteraction,
        userIsAuthor: userId !== undefined && userId === thread.userId,
        replies: await Promise.all(replies.map(r => createGetRepliesModel(r, userId))),
        taggedElementIds: userId !== undefined ? await getTaggedElementIds(thread.taggedElementIds, userId) : thread.taggedElementIds.map(id => ({ id })),
        taggedByElementIds: thread.taggedByElementIds,
        replyCount: thread.replyCount
    }
    return response;
}


const getTaggedElementIds = async (taggedElementIds: string[], userId?: string): Promise<{ id: string, userIsAuthor?: true }[]> => {
    let replyCollection = await getReplyCollection();
    let threadCollection = await getThreadCollection();

    let replies = await replyCollection.find({ id: { $in: taggedElementIds }, userId: userId }).toArray();
    let threads = await threadCollection.find({ id: { $in: taggedElementIds }, userId: userId }).toArray();


    return taggedElementIds.map(id => {
        if (replies.find(r => r.id === id)) {
            return { id, userIsAuthor: true }
        }
        else if (threads.find(t => t.id === id)) {
            return { id, userIsAuthor: true }
        }
        else {
            return { id }
        }
    })
}


const createGetRepliesModel = async (reply: ReplyModel, userId?: string): Promise<GetReplyModel> => {
    const response: GetReplyModel = {
        id: reply.id,
        content: reply.content,
        author: reply.author,
        timestamp: reply.timestamp,
        userIsAuthor: userId !== undefined && userId === reply.userId,
        taggedElementIds: userId !== undefined ? await getTaggedElementIds(reply.taggedElementIds, userId) : reply.taggedElementIds.map(id => ({ id })),
        taggedByElementIds: reply.taggedByElementIds,
        image: await createGetImageModel(reply.imageId)
    }
    return response;
}

const createGetImageModel = async (imageId?: string): Promise<GetImageModel | undefined> => {
    if (!imageId) return undefined;
    const imageCollection = await getImageCollection();
    let image = await imageCollection.findOne({ id: imageId }, { projection: { _id: 0 } });
    if (!image) {
        return undefined;
    }
    const ret: GetImageModel = {
        id: image.id,
        dimensions: image.dimensions,
        size: image.size,
        url: image.url
    }
    return ret;
}


export const getThread = async (id: string, userId?: string): Promise<GetThreadModel | { redirectTo: string }> => {
    const collection = await getThreadCollection();
    const replyCollection = await getReplyCollection();
    let thread = await collection.findOne({ id }, { projection: { _id: 0 } });
    if (!thread) {
        const reply = await replyCollection.findOne({ id }, { projection: { _id: 0 } })
        if (!reply) {
            throw HTTPError(404, "Thread not found");
        }
        const actualThreadId = reply.threadId;
        return { redirectTo: actualThreadId };

    }
    let replies = await replyCollection.find({ threadId: id }, { projection: { _id: 0 } }).toArray();
    return await createGetThreadModel(thread, replies, userId)
}

export const createReply = async (threadId: string, r: CreateReplyModel, userId: string): Promise<string> => {
    try {
        const imageCollection = await getImageCollection();
        if (r.imageId) {
            const image = await imageCollection.findOne({ id: r.imageId, associatedElement: "" });
            if (!image) {
                throw HTTPError(404, "Image not found");
            }
        }
        await getThread(threadId); // check if thread exists, method throws error if it doesn't
        const currentId = await getCurrentId();
        const collection = await getReplyCollection();
        const timestamp = Date.now();
        const reply: ReplyModel = {
            ...r,
            author: r.author ?? "Anonymous",
            userId: userId,
            imageId: r.imageId,
            threadId,
            id: currentId,
            timestamp,
            taggedByElementIds: [],
            taggedElementIds: r.taggedElementIds ?? []
        }
        await (await getThreadCollection()).updateOne({ id: threadId }, { $set: { lastInteraction: timestamp }, $inc: { replyCount: 1 } });
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
    deletedIds.push(...threads.map(t => t.id));
    for (let thread of threads) {
        let replies = await replyCollection.find({ threadId: thread.id }).toArray()
        deletedIds.push(...replies.map(r => r.id));
        await replyCollection.deleteMany({ threadId: thread.id });
    }
    await collection.deleteMany({ timestamp: { $lt: timestamp } });
    const imageCollection = await getImageCollection();
    await imageCollection.updateMany({ associatedElement: { $in: deletedIds } }, { $set: { associatedElement: "" } });
    const utils = await getUtilsCollection();
    utils.updateOne({ id: "lastUpdated" }, { $set: { value: currentTimestamp.toString() } }, { upsert: true });
    utils.updateOne({ id: "hash" }, { $set: { value: await getCurrentHash(currentTimestamp) } }, { upsert: true })
}


const getThreads = async (page: number, pageSize: number, orderBy: SortBy, order: MySortDirection, userId?: string): Promise<{ threads: GetThreadPreviewModel[], total: number }> => {
    const collection = await getThreadCollection();
    const replyCollection = await getReplyCollection();
    let total = await collection.countDocuments();
    let query = {};
    let filter = {};
    switch (orderBy) {
        case SortBy.timestamp:
            query = { timestamp: order == MySortDirection.asc ? 1 : -1 };
            break;
        case SortBy.lastInteraction:
            query = { lastInteraction: order == MySortDirection.asc ? 1 : -1 };
            break;
        case SortBy.replyCount:
            query = { replyCount: order == MySortDirection.asc ? 1 : -1 };
            break;
    }
    let threads = await collection.find(filter, { projection: { _id: 0 } }).sort(query).skip(page * pageSize).limit(pageSize).toArray();
    // Get the first 7 replies for each thread
    let threadsResponse: GetThreadPreviewModel[] = []
    for (let thread of threads) {
        let replies = await replyCollection.find({ threadId: thread.id }, { projection: { _id: 0 } }).sort({ timestamp: 1 }).limit(4).toArray();
        let totalReplies = await replyCollection.countDocuments({ threadId: thread.id });
        threadsResponse.push({ ...await createGetThreadModel(thread, replies, userId), replyCount: totalReplies });
    }
    return {
        threads: threadsResponse,
        total
    };
}


export default { createThread, getThread, createReply, getThreads };