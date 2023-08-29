import { getClient, getDb } from "./db";

export const getCurrentId = async () => {
    const client = await getClient();
    const session = client.startSession();
    try {
        const db = await getDb();
        const { value } = (await db.collection("utils").findOneAndUpdate({ id: "current" }, { $inc: { value: 1 } }, { session, upsert: true })).value ?? { value: 0 };
        return value.toString();
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    finally {
        session.endSession();
    }
}
