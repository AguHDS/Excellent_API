import express from "express";
import { openaiImageController } from "../controllers/openaiImageController.js";
import { openaiImageMiddleware } from "../middlewares/openaiImageMiddleware.js";

const router = express.Router();

router.post("/", openaiImageMiddleware, openaiImageController);

export default router;
