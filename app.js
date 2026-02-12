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
app.use("/", express.static("public"));

// Backend-ean jasotako JSON string-ak JavaScript-eko objetuetan
// bihurtzeko middlewarea definitu
app.use(express.json());

// Backend-ean jasotako datuak formulario batetik heltzen
// direnean (x-www-form-encoded) JavaScript-eko objetuetan
// bihurtzeko middlewarea definitu
app.use(express.urlencoded({ extended: true }));

// OpenAI bezeroaren instantzia bat sortu eta API key-a pasatu
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// POST eskaera bat jasotzen denean, OpenAI API-a deitu eta
// erantzuna bidali
app.post("/api/translate", async (req, res) => {
    // Eskaeraren gorputzean jasotako datuak hartu
    const { text, targetLang } = req.body;
    // OpenAI API-a deitu eta itzulitako testua lortu
    const promptSystem1 = "Itzultzaile profesionala zara.";
    const promptSystem2 = `Jasotako testua ${targetLang} hizkuntzara itzuli.`;
    const promptSystem3 = "Erabiltzaileak bialdutako testuaren itzulpen zuzena itzuli behar duzu." + "Beste erantzun mota guztiak debekatuta daude.";
    const promptUser = `Itzuli testua: ${targetLang} hizkuntzara hurrengo testua: ${text}`;
    // OpenAI-ko modelora eskaera egin (await-ak async-a behar du callback-eko funtzioan)

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: promptSystem1 },
                { role: "system", content: promptSystem2 },
                { role: "system", content: promptSystem3 },
                { role: "user", content: promptUser },
            ],
            max_tokens: 500,
            response_format: {
                type: "text",
            },
        });
        const translatedText = completion.choices[0].message.content;
        return res.status(200).json({ translatedText });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Errorea itzulpenan." });
    }
});
app.listen(PORT, () => {
    console.log(`Zerbitzaria martxan http://localhost:${PORT} helbidean`);
});