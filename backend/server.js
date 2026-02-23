import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { uploadRouter } from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use upload routes
app.use("/upload", uploadRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});