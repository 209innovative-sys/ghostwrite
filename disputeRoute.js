import express from "express";
import fetch from "node-fetch";
const router = express.Router();

router.post("/dispute", async (req, res) => {
  const { orderId, customerName, product, issue, evidence } = req.body;

  try {
    const prompt = `
    You are an expert chargeback dispute writer. Write a professional, convincing, and factual response letter
    to win a chargeback. Use the following data:
    - Order ID: ${orderId}
    - Customer Name: ${customerName}
    - Product: ${product}
    - Issue Summary: ${issue}
    - Evidence: ${evidence}

    Format your reply with clear sections:
    1. Summary of Transaction
    2. Customer Activity
    3. Evidence & Proof
    4. Professional Conclusion
    Keep tone factual, respectful, and persuasive.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content ?? "No AI response";
    res.json({ result });
  } catch (err) {
    console.error("Dispute API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
