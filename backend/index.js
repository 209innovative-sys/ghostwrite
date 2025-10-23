import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(express.json());

const allowOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: allowOrigin, credentials: true }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/rewrite", async (req, res) => {
  try {
    const { text, mode = "Engage" } = req.body;
    const rules = {
      Engage: "catchy, curiosity-driven",
      Clarify: "simple, credible",
      Charm: "witty, light",
      "Ghost Mode": "influencer tone"
    };
    const prompt = `Rewrite to ${rules[mode]}. Keep meaning. Text:\n"""${text}"""`;
    const r = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }]
    });
    res.json({ rewritten: r.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.listen(5000, () => console.log("API on :5000"));
