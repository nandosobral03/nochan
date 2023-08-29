const dotenv = require('dotenv');
import { unlinkSync, writeFileSync } from "node:fs";

dotenv.config();
import { fileTypeFromBlob } from "file-type";
import { HTTPError } from "./error";
import { getImageCollection } from "./db";
import path from "node:path";
import fs from "node:fs";

export const saveImage = async (file: Blob, id: string) => {
    const collection = await getImageCollection();
    const fileType = await fileTypeFromBlob(file);
    if (!fileType) throw HTTPError(400, "Invalid file type");
    fs.mkdirSync(path.join(process.cwd(), "images"), { recursive: true });
    writeFileSync(path.join(process.cwd(), `images/${id}.${fileType.ext}`), Buffer.from(await file.arrayBuffer()));
    await collection.insertOne({ id, timestamp: Date.now(), path: `./images/${id}.${fileType.ext}`, associatedElement: "", url: `${process.env.SERVER_URL}/images/${id}.${fileType.ext}` });
    return id;
}

export const removeHangingImages = async () => {
    const timestamp = Date.now() - 1000 * 60 * 5;
    const collection = await getImageCollection();
    const images = await collection.find({ timestamp: { $lt: timestamp }, associatedElement: "" }).toArray();
    for (const image of images) {
        try {
            unlinkSync(path.join(process.cwd(), image.path));
        } catch (e) {
            console.log(e);
        }
    }
    collection.deleteMany({ timestamp: { $lt: timestamp }, associatedElement: "" });
}

