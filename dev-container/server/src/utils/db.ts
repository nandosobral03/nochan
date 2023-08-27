const dotenv = require("dotenv");
import { Db, MongoClient } from "mongodb";



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