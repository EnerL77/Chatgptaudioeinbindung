import express from "express";
import fetch from "node-fetch";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 
const MODEL  = process.env.REALTIME_MODEL || "gpt-4o-realtime-preview";
const VOICE  = process.env.REALTIME_VOICE || "alloy";
const INSTR  = process.env.REALTIME_INSTRUCTIONS || "Antworte kurz, klar, freundlich, auf Deutsch.";

// Route: Ephemeres Token für Browser erzeugen
app.post("/session", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY missing" });
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: MODEL, voice: VOICE, instructions: INSTR })
    });
    if (!r.ok) return res.status(500).send(await r.text());
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server läuft: http://localhost:${PORT}`));
