export const openaiMiddleware = (req, res, next) => {
  if (!req.body || typeof req.body.prompt !== "string" || req.body.prompt.trim().length < 5) {
    return res.status(400).json({ error: "Invalid or missing prompt" });
  }
  next();
};
