import { getClient, getDb } from "./db";

export const getCurrentId = async () => {
    const client = await getClient();
    const session = client.startSession();
    try {
        const db = await getDb();
        const { numberField } = (await db.collection("utils").findOneAndUpdate({ id: "current" }, { $inc: { numberField: 1 } }, { session, upsert: true })).value ?? { numberField: 0 };
        return numberField.toString();
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    finally {
        session.endSession();
    }
}
