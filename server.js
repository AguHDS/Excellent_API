import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import gptRoute from "./routes/openai.js"; 
import gptImageRoute from "./routes/openaiImage.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api/gpt", gptRoute);
app.use("/api/gpt-image", gptImageRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Listening on port ${PORT}`));
