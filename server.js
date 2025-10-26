// ============================
// 🚀 GhostWrite Server
// ============================

// --- Imports ---
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import disputeRoute from "./disputeRoute.js";   // AI dispute route
import Stripe from "stripe";                    // Stripe payments

// --- Config ---
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- Routes ---

// ✅ Attach modular dispute route
app.use("/api", disputeRoute);

// ✅ GhostWrite rewrite endpoint
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
    console.error("Rewrite error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Stripe checkout session
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "AI Chargeback Letter" },
          unit_amount: 999 // $9.99
        },
        quantity: 1
      }],
      success_url: "https://ghostwrite-1.onrender.com/chargeback.html?success=true",
      cancel_url: "https://ghostwrite-1.onrender.com/chargeback.html?canceled=true"
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Catch-all: serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 GhostWrite server running on port ${PORT}`));
