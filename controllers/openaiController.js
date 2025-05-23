import { sendPrompt } from "../services/openai_service.js";

export const openaiController = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await sendPrompt(prompt);
    res.json({ output: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
