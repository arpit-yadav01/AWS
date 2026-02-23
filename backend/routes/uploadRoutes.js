// routes/uploadRoutes.js
import express from "express";
import { uploadSingle, uploadMultiple } from "../controllers/s3Controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadSingle);
router.post("/upload/multiple", upload.array("files"), uploadMultiple);

export const uploadRouter = router;   // <-- named export