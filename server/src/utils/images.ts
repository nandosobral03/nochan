const dotenv = require('dotenv');
import { unlinkSync, writeFileSync } from "node:fs";
import sizeOf from "image-size";
dotenv.config();
import { fileTypeFromBlob } from "file-type";
import { HTTPError } from "./error";
import { getImageCollection } from "./db";
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";


export const saveImage = async (file: Blob, id: string) => {
    const collection = await getImageCollection();
    const fileType = await fileTypeFromBlob(file);
    if (!fileType) throw HTTPError(400, "Invalid file type");
    fs.mkdirSync(path.join(process.cwd(), "images"), { recursive: true });
    let imagePath = path.join(process.cwd(), `images/${id}.${fileType.ext}`);
    writeFileSync(imagePath, Buffer.from(await file.arrayBuffer()));
    const size = sizeOf(path.join(process.cwd(), `images/${id}.${fileType.ext}`));

    let newWidth = size.width;
    let newHeight = size.height;
    if ((size.height ?? 0) > 384 || (size.width ?? 0) > 320) {
        if (size.height! > size.width!) {
            newHeight = 384;
            newWidth = Math.round((size.width! / size.height!) * 384);
        } else {
            newWidth = 320;
            newHeight = Math.round((size.height! / size.width!) * 320);
        }
        await sharp(path.join(process.cwd(), `images/${id}.${fileType.ext}`))
            .rotate()
            .resize(newHeight, newWidth)
            .withMetadata()
            .png()
            .toFile(path.join(process.cwd(), `images/${id}-compressed.png`));
    }

    await collection.insertOne(
        {
            id, timestamp: Date.now(),
            path: `./images/${id}.${fileType.ext}`,
            associatedElement: "",
            url: `${process.env.SERVER_URL}/images/${id}.${fileType.ext}`,
            dimensions: `${size.width}x${size.height}`,
            size: file.size
        });
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

