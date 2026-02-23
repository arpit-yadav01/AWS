import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const uploadSingle = async (req, res) => {
  const file = req.file;
  const fileStream = fs.createReadStream(file.path);

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: file.originalname,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    fs.unlinkSync(file.path);
    res.json({ message: "Upload success", url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.originalname}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

export const uploadMultiple = async (req, res) => {
  const files = req.files;
  try {
    const urls = [];
    for (const file of files) {
      const fileStream = fs.createReadStream(file.path);
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: file.originalname,
        Body: fileStream,
        ContentType: file.mimetype,
      };
      await s3.send(new PutObjectCommand(params));
      fs.unlinkSync(file.path);
      urls.push(`https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.originalname}`);
    }
    res.json({ message: "Upload success", urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};