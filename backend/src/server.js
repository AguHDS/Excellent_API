require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Permití tu extensión y null para entornos embebidos
      const allowedOrigins = [
        "chrome-extension://ogidnlfdldfkccggibioackfhkahnlon",
        "null",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-extension-key", "x-extension-id"],
  })
);

app.options("/*", cors());
app.use(express.json());

//para testing
app.get("/api/debug", (req, res) => {
  res.json({
    extensionKey: process.env.EXTENSION_KEY ? "✅ definida" : "❌ falta",
    appscriptKey: process.env.APPSCRIPT_KEY ? "✅ definida" : "❌ falta",
    openaiKey: process.env.OPENAI_APIKEY ? "✅ definida" : "❌ falta",
    env: process.env.NODE_ENV || "desconocido",
  });
});

app.post("/api/gpt", async (req, res) => {
  const clientKey = req.headers["x-extension-key"];
  const extensionKey = process.env.EXTENSION_KEY;
  const appscriptKey = process.env.APPSCRIPT_KEY;

  if (
    !clientKey ||
    (clientKey !== extensionKey && clientKey !== appscriptKey)
  ) {
    return res.status(403).json({ error: "Forbidden: invalid key" });
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
