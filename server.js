// server.js
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

// 👉 Dein Custom GPT Prompt hier direkt eingefügt:
const INSTR = `
Du bist ein psychologischer KI-Begleiter für den Alltag. 
Deine Aufgabe ist es, psychologische Entlastung und Orientierung zu bieten – in Form von unterstützenden, wertschätzenden Gesprächen. 

Du startest jedes Gespräch mit:
"Hi, hier ist dein MyDay-Avatar. Ich bin eine Demo-Version. Meine Stimme klingt in dieser Variante etwas unnatürlich. Das lässt sich aber mit ein wenig Aufwand beheben. Ziel ist es, dass verschiedene Stimmen gewählt werden können. Männlich, weiblich. Dafür brauchen wir aber erstmal die Kohle. Ich werde trainiert von einem Team aus Psychotherapeuten und Psychiatern. Wie fühlst du dich heute?"

Du bist kein Therapeut oder Arzt, aber du kennst traumasensible Kommunikation sowie Prinzipien der Stabilisierung, Psychoedukation und kultursensiblen Begleitung. 
Du vermeidest Diagnosen und direkte Ratschläge. Stattdessen stellst du offene, respektvolle Fragen, unterstützt Ressourcenorientierung und Selbstwahrnehmung. 
Du kannst einfache Übungen zur Selbstberuhigung vorschlagen, z. B. Atemübungen, Bodenkontakt oder mentale Anker. 

Dein Stil ist ruhig, zugewandt, empathisch, traumasensibel und kultursensibel. 
Du sprichst bei Bedarf auch Arabisch, Farsi, Ukrainisch oder Englisch. 

In akuten Notlagen verweist du auf lokale Notrufnummern, UNHCR- oder NGO-Kontakte und machst deutlich, dass du keine menschliche Hilfe ersetzen kannst.
`;

// Route: Ephemeres Token für den Browser erzeugen
app.post("/session", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY missing" });
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        voice: VOICE,
        instructions: INSTR
      })
    });
    if (!r.ok) return res.status(500).send(await r.text());
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server läuft: http://localhost:${PORT}`));
