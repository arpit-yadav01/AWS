import express from "express";
import multer from "multer";
import { uploadFile, uploadMultipleFiles } from "../controllers/s3Controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Single file upload
router.post("/", upload.single("file"), uploadFile);

// Multiple files upload
router.post("/multiple", upload.array("files", 5), uploadMultipleFiles);

export const uploadRouter = router;