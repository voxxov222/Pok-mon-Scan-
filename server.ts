import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = 3000;

// Initialize Gemini
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize Gemini", e);
}

// API Routes
app.post('/api/scan-card', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API not configured." });
    }

    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided." });
    }

    // Strip data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `
      You are an expert Pokemon card appraiser, PSA/BGS grading specialist, and TCG market analyst. 
      Analyze this image of a Pokemon card and complete the following:
      
      1. Identification: Name, Set name, Card number (e.g. 004/102 or 151/165), Rarity (e.g. Rare Holo, Secret Rare, Ultra Rare, Common), and Energy Type (Fire, Water, Grass, Lightning, Psychic, Fighting, Darkness, Metal, Dragon, Colorless).
      2. AI Grading Analysis: Carefully examine the card image for Centering, Edges, Surface, and Corners. Score each subcategory from 1 to 10 with a short observational note. Provide an overall estimated grade score (from 1.0 to 10.0, e.g. 9.5) and a comprehensive grade reasoning summary.
      3. Market Price Research: Use Google Search to look up current market price points for this exact card in USD across major platforms (TCGPlayer, PriceCharting, eBay sold listings). Provide low price, high price, median price, and source link URLs.
      4. Image: Provide a direct high quality public image URL for this Pokemon card if known (e.g. from pokemontcg.io or official TCG databases).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        { role: 'user', parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: base64Data } }] }
      ],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The name of the Pokemon or card" },
            set: { type: Type.STRING, description: "The set name (e.g. Base Set, 151, Crown Zenith, Evolving Skies)" },
            cardNumber: { type: Type.STRING, description: "The card number (e.g. 4/102, 215/198)" },
            rarity: { type: Type.STRING, description: "The card rarity (e.g. Ultra Rare, Secret Rare, Holo Rare, Common)" },
            energyType: { type: Type.STRING, description: "Energy element: Fire, Water, Grass, Lightning, Psychic, Fighting, Darkness, Metal, Dragon, or Colorless" },
            condition: { type: Type.STRING, description: "Estimated physical condition description (Near Mint, Mint, Lightly Played, etc.)" },
            lowPrice: { type: Type.NUMBER, description: "The lowest market price found in USD" },
            medianPrice: { type: Type.NUMBER, description: "The median/average market price found in USD" },
            highPrice: { type: Type.NUMBER, description: "The highest market price found in USD" },
            sourceUrl: { type: Type.STRING, description: "A URL source link to the pricing source" },
            imageUrl: { type: Type.STRING, description: "A high-res image URL of the card" },
            estimatedGrade: { type: Type.NUMBER, description: "Overall AI estimated PSA/BGS style grade from 1.0 to 10.0" },
            subGrades: {
              type: Type.OBJECT,
              properties: {
                centering: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER, description: "Score from 1 to 10" },
                    note: { type: Type.STRING, description: "Observational note on border alignment" }
                  },
                  required: ["score", "note"]
                },
                edges: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER, description: "Score from 1 to 10" },
                    note: { type: Type.STRING, description: "Observational note on edge whitening or silvering" }
                  },
                  required: ["score", "note"]
                },
                surface: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER, description: "Score from 1 to 10" },
                    note: { type: Type.STRING, description: "Observational note on surface scratches or print lines" }
                  },
                  required: ["score", "note"]
                },
                corners: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER, description: "Score from 1 to 10" },
                    note: { type: Type.STRING, description: "Observational note on corner wear or dings" }
                  },
                  required: ["score", "note"]
                }
              },
              required: ["centering", "edges", "surface", "corners"]
            },
            gradeReasoning: { type: Type.STRING, description: "Detailed explanation of why this overall grade score was assigned" },
            sources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  type: { type: Type.STRING }
                },
                required: ["name", "url", "price"]
              },
              description: "List of top pricing sources found"
            }
          },
          required: ["name", "set", "cardNumber", "rarity", "lowPrice", "highPrice", "sourceUrl", "estimatedGrade", "gradeReasoning"]
        }
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } else {
      res.status(500).json({ error: "No response from Gemini Vision" });
    }
  } catch (error) {
    console.error("Error scanning card:", error);
    res.status(500).json({ error: "Failed to scan card. Please try again." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
