import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import disputeRoute from "./disputeRoute.js";  // ✅ Added this line

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/api", disputeRoute);  // ✅ Added this line

app.post("/api/rewrite", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are GhostWrite, an expert rewriting assistant." },
          { role: "user", content: `Rewrite this text to make it clearer and more engaging:\n${text}` }
        ]
      })
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content ?? "No response";
    res.json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 GhostWrite server running on port ${PORT}`));
