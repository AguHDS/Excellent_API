import express from "express";
import { openaiController } from "../controllers/openaiController.js";
import { openaiMiddleware } from "../middlewares/openaiController.js";

const router = express.Router();

router.post("/", openaiMiddleware, openaiController);

export default router;
