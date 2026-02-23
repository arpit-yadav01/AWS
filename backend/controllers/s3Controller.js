import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Single file upload
export const uploadFile = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET,
    Key: file.originalname,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    fs.unlinkSync(file.path); // remove local file
    res.json({
      message: "Upload success",
      url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.originalname}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

// Multiple files upload
export const uploadMultipleFiles = async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) return res.status(400).json({ error: "No files uploaded" });

  const uploadedFiles = [];

  try {
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

      uploadedFiles.push({
        name: file.originalname,
        url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.originalname}`,
      });
    }

    res.json({ message: "Files uploaded successfully", files: uploadedFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};