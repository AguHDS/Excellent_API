import { sendImagePrompt } from '../services/openai_service.js';

export const openaiImageController = async (req, res) => {
  const { image_base64, instruction } = req.body;

  try {
    const result = await sendImagePrompt(image_base64, instruction);
    res.status(200).json({ output: result });
  } catch (error) {
    console.error("Error in OpenAI image processing:", error.message);
    res.status(500).json({ error: "Failed to process image prompt with OpenAI" });
  }
};
