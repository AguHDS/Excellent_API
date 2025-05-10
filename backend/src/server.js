require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

//always update with the extension id
app.use(cors({ origin: "chrome-extension://ogidnlfdldfkccggibioackfhkahnlon"} ));

app.use(express.json());

app.post("/api/gpt", async (req, res) => {
  const clientKey = req.headers["x-extension-key"];
  const validKey = process.env.EXTENSION_KEY;

  if (!clientKey || clientKey !== validKey) {
    return res.status(403).json({ error: "Forbidden: invalid client key" });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "No prompt provided" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_APIKEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await response.json();

    //Validation in case there's an error with api key of OpenAI
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "OpenAI response malformed" });
    }

    res.json({ output: data.choices[0].message.content.trim() });
    return;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
