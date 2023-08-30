const dotenv = require("dotenv");
import { Collection, Db, MongoClient } from "mongodb";
import { ReplyModel, ThreadModel } from "../models/thread.model";



dotenv.config();
let client: MongoClient | null = null;

export const getClient = async () => {
    if (!client) {
        client = await MongoClient.connect(process.env.MONGO_URL || "mongodb://host.docker.internal:27017");
    }
    return client;
}

export const getDb = async (): Promise<Db> => {
    const client = await getClient();
    return client.db("nochan");
}

export const getThreadCollection = async (): Promise<Collection<ThreadModel>> => {
    const db = await getDb();
    return db.collection<ThreadModel>("threads");
}

export const getReplyCollection = async (): Promise<Collection<ReplyModel>> => {
    const db = await getDb();
    return db.collection<ReplyModel>("replies");
}

export const getImageCollection = async (): Promise<Collection<{
    id: string,
    path: string,
    url: string,
    timestamp: number,
    associatedElement: string,
    dimensions: string,
    size: number
}>> => {
    const db = await getDb();
    return db.collection("images");
}

export const getUtilsCollection = async (): Promise<Collection<{
    id: string,
    value: string
    timestamp: number,

}>> => {
    const db = await getDb();
    return db.collection("utils");
}