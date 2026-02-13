// Dependentziak inportatu
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

// API key-a kargatu
dotenv.config();

// Express kargatu
const app = express();
const PORT = process.env.PORT || 3000;

// Frontend-eko fitxategiak zerbitzatzeko middlewarea definitu
app.use(express.static("public"));

// JSON eta URL-encoded datuak prozesatzeko middlewareak
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OpenAI bezeroaren instantzia bat sortu
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Txatbotaren endpoint-a sortu (POST eskaera)
app.post("/api/chat", async (req, res) => {
    // Frontend-etik datorren erabiltzailearen mezua hartu
    const { mezua } = req.body;

    // Txatbotaren nortasuna edo portaera definitu
    const promptSystem = "Laguntzaile birtual euskaldun eta atsegina zara. Erabiltzaileei modu argi eta lagungarrian erantzuten diezu.";

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Modeloa
            messages: [
                { role: "system", content: promptSystem },
                { role: "user", content: mezua }
            ],
            max_tokens: 500,
        });

        // OpenAI-ren erantzuna atera
        const erantzuna = completion.choices[0].message.content;
        
        // Erantzuna frontend-era bidali JSON formatuan
        return res.status(200).json({ erantzuna });

    } catch (error) {
        console.error("Errorea OpenAI-rekin:", error);
        return res.status(500).json({ error: "Errorea txatbotarekin komunikatzean." });
    }
});

app.listen(PORT, () => {
    console.log(`Zerbitzaria martxan http://localhost:${PORT} helbidean`);
});