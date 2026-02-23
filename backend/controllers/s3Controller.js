// controllers/s3Controller.js

import fs from "fs";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../utils/s3Client.js";


// ==============================
// SINGLE FILE UPLOAD
// ==============================

export const uploadSingle = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileStream = fs.createReadStream(file.path);
    const key = file.originalname; // later we will improve this

    // 1️⃣ Upload file to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: fileStream,
        ContentType: file.mimetype,
      })
    );

    // 2️⃣ Generate signed URL (valid 5 minutes)
    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
      }),
      { expiresIn: 300 }
    );

    // 3️⃣ Remove local temp file
    fs.unlinkSync(file.path);

    return res.json({
      message: "Upload success",
      signedUrl,
      expiresIn: "5 minutes",
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
};


// ==============================
// MULTIPLE FILE UPLOAD
// ==============================

export const uploadMultiple = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const signedUrls = [];

    for (const file of files) {
      const fileStream = fs.createReadStream(file.path);
      const key = file.originalname;

      // Upload
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: key,
          Body: fileStream,
          ContentType: file.mimetype,
        })
      );

      // Generate signed URL
      const signedUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: key,
        }),
        { expiresIn: 300 }
      );

      fs.unlinkSync(file.path);

      signedUrls.push(signedUrl);
    }

    return res.json({
      message: "Upload success",
      signedUrls,
      expiresIn: "5 minutes",
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
};