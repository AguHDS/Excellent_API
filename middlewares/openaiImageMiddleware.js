export const openaiImageMiddleware = (req, res, next) => {
  const { image_base64, instruction } = req.body;

  if (!image_base64 || typeof image_base64 !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'image_base64'" });
  }

  if (!instruction || typeof instruction !== "string" || instruction.trim() === "") {
    return res.status(400).json({ error: "Missing or invalid 'instruction'" });
  }

  // Solo validamos tamaño
  const MAX_SIZE = 2 * 1024 * 1024;
  const sizeInBytes = Buffer.byteLength(image_base64, "base64");
  if (sizeInBytes > MAX_SIZE) {
    return res.status(400).json({ error: "Image too large (max 2MB)" });
  }

  // ✅ Validación mínima para base64: intentamos decodificar
  try {
    Buffer.from(image_base64, "base64");
  } catch (err) {
    return res.status(400).json({ error: "Invalid base64 encoding." });
  }

  next();
};
