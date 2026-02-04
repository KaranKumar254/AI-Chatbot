const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 4004;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        
        // --- YE URL SABSE IMPORTANT HAI ---
        // Version 'v1beta' aur model name 'gemini-1.5-flash' ka combination
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: message }]
            }]
        });

        // Response Check
        if (response.data.candidates && response.data.candidates[0].content) {
            const aiText = response.data.candidates[0].content.parts[0].text;
            res.json({ response: aiText });
        } else {
            res.json({ response: "AI is silent. Try again." });
        }

    } catch (error) {
        console.error("--- TERMINAL ERROR LOG ---");
        if (error.response) {
            // Yeh terminal mein dikhayega ki 404 hai ya 400
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data));
            
            res.status(500).json({ 
                response: "Google Error: " + error.response.data.error.message 
            });
        } else {
            console.error("Error:", error.message);
            res.status(500).json({ response: "Connection Failed: " + error.message });
        }
    }
});

app.listen(PORT, () => console.log(`🚀 Server Running: http://localhost:${PORT}`));