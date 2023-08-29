import { getReplyCollection, getThreadCollection, getUtilsCollection } from "../utils/db"

export const getAllElements = async (timestamp?: number) => {
    let allElementsContent: { id: string, content: string }[] = [];
    let replies = await getReplyCollection();
    let threads = await getThreadCollection();
    let allThreads = await threads.find(timestamp ? { timestamp: { $lt: timestamp } } : {}).toArray();
    let allReplies = await replies.find(timestamp ? { timestamp: { $lt: timestamp } } : {}).toArray();
    // Inserts all elements ordered by id
    allElementsContent = allElementsContent.concat(allThreads.map((thread) => { return { id: thread.id, content: thread.content } }), allReplies.map((reply) => { return { id: reply.id, content: reply.content } }));
    allElementsContent.sort((a, b) => { return parseInt(a.id) - parseInt(b.id) });
    return allElementsContent;
}


export const getCurrentHash = async (timestamp?: number) => {
    const utils = await getUtilsCollection();
    let elements = await getAllElements(timestamp);
    let lowest = elements[0]?.id
    if (lowest) {
        utils.updateOne({ id: "smallestId" }, { $set: { value: (lowest).toString() } }, { upsert: true });
    }

    let hasher = new Bun.CryptoHasher("blake2b256")
    if (timestamp) {
        hasher.update(timestamp.toString())
    }
    for (let element of elements) {
        hasher.update(element.content)
    }
    return hasher.digest("hex")
}

export const getAppHash = async () => {
    const utils = await getUtilsCollection();
    let hash = await utils.findOne({ id: "hash" });
    let lowest = await utils.findOne({ id: "smallestId" });
    let lastUpdate = await utils.findOne({ id: "lastUpdated" });
    return {
        hash: hash!.value,
        lowestId: lowest!.value,
        lastUpdatedHash: lastUpdate!.value
    }
}