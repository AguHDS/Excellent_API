import fetch from "node-fetch";
import { OPENAI_APIKEY } from "../config/openai.js";

export const sendPrompt = async (prompt) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_APIKEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.choices || !data.choices[0]) {
    throw new Error("OpenAI response error or malformed");
  }

  return data.choices[0].message.content.trim();
};

export const sendImagePrompt = async (base64Image, instruction) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_APIKEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: instruction },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.choices || !data.choices[0]) {
    throw new Error("OpenAI image response error or malformed");
  }

  return data.choices[0].message.content.trim();
};
