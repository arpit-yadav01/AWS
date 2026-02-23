import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { uploadRouter } from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", uploadRouter); // ← prefix all routes with /api

app.listen(5000, () => console.log("Server running on port 5000"));