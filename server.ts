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
    ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
} catch (e) {
  console.error("Failed to initialize Gemini", e);
}

// Helper to check for 429/quota error
function isQuotaError(err: any): boolean {
  const msg = String(err?.message || err || "").toLowerCase();
  return msg.includes("429") || msg.includes("resource_exhausted") || msg.includes("quota");
}

// API Route: Search Cards directly from Pokemon TCG API (No Gemini API quota used!)
app.get('/api/search-cards', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) {
      return res.json({ data: [] });
    }

    const cleanQuery = query.replace(/[^a-zA-Z0-9 -]/g, "");
    const tcgRes = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"*${encodeURIComponent(cleanQuery)}*"&pageSize=20`, {
      headers: { 'User-Agent': 'PokeVault-AI', 'Accept': 'application/json' }
    });

    if (!tcgRes.ok) {
      return res.status(tcgRes.status).json({ error: "Failed to fetch from Pokemon TCG API" });
    }

    const tcgData = await tcgRes.json();
    const formattedCards = (tcgData.data || []).map((card: any) => {
      const prices = card.tcgplayer?.prices || {};
      const priceType = prices.holofoil || prices.reverseHolofoil || prices.normal || Object.values(prices)[0] || {};
      
      return {
        name: card.name,
        set: card.set?.name || 'Unknown Set',
        cardNumber: card.number || '',
        rarity: card.rarity || 'Common',
        energyType: card.types?.[0] || 'Colorless',
        condition: 'Near Mint',
        lowPrice: priceType.low || 0.99,
        medianPrice: priceType.mid || priceType.market || 1.99,
        highPrice: priceType.high || 4.99,
        sourceUrl: card.tcgplayer?.url || `https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=${encodeURIComponent(card.name)}`,
        imageUrl: card.images?.large || card.images?.small || '',
        estimatedGrade: 9.0,
        subGrades: {
          centering: { score: 9.0, note: "Well centered visual borders" },
          edges: { score: 9.0, note: "Clean edges" },
          surface: { score: 9.0, note: "Good surface finish" },
          corners: { score: 9.0, note: "Sharp corners" }
        },
        gradeReasoning: "Standard Near Mint card condition from official Pokemon TCG catalog.",
        sources: card.tcgplayer?.url ? [{
          name: 'TCGPlayer',
          url: card.tcgplayer.url,
          price: priceType.mid || priceType.market || 1.99,
          type: 'API'
        }] : []
      };
    });

    res.json({ data: formattedCards });
  } catch (err: any) {
    console.error("Error searching cards:", err);
    res.status(500).json({ error: "Failed to search cards" });
  }
});

// API Route: Scan Card with Gemini
app.post('/api/scan-card', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured. Please add process.env.GEMINI_API_KEY in Settings > Secrets." });
    }

    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided." });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `
      You are an expert Pokemon card appraiser, PSA/BGS grading specialist, and TCG market analyst. 
      Analyze this image of a Pokemon card and complete the following:
      
      CRITICAL MATCHING INSTRUCTIONS:
      - Accurately read the card's specific Set Code or Card Number at the bottom (e.g. "151/198" or "025/165").
      - Detect if the card is a standard version, a Reverse Holo, a Holo Foil, Shiny, Full Art, or Alt Art.
      - Explicitly state if it is a "Shiny" variant or "Holo" vs "Non-Holo" in the rarity.
      - Ensure the Set Name exactly matches the visual set symbol and year.

      1. Identification: Name, Set name, Card number, Rarity (e.g. Rare Holo, Secret Rare, Ultra Rare, Common, Shiny Vault), and Energy Type (Fire, Water, Grass, Lightning, Psychic, Fighting, Darkness, Metal, Dragon, Colorless).
      2. AI Grading Analysis: Carefully examine the card image for Centering, Edges, Surface, and Corners. Score each subcategory from 1 to 10 with a short observational note. Provide an overall estimated grade score (from 1.0 to 10.0, e.g. 9.5) and a comprehensive grade reasoning summary.
      3. Market Price Research: Provide low price, high price, median price, and source link URLs.
      4. Image: Provide a direct high quality public image URL for this Pokemon card if known.
    `;

    const responseSchema = {
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
    };

    let responseText: string | undefined;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          { role: 'user', parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: base64Data } }] }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema
        }
      });
      responseText = response.text;
    } catch (primaryErr: any) {
      console.warn("Gemini vision scan call failed:", primaryErr?.message);
      
      if (isQuotaError(primaryErr)) {
        return res.status(429).json({ 
          error: "Gemini API daily request quota reached (Free Tier limit: 20 requests/day). Please wait before trying vision scan again, or use manual card search.",
          code: "QUOTA_EXCEEDED"
        });
      }

      // Retry once without schema ONLY if NOT a quota error
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [
            { role: 'user', parts: [{ text: prompt + "\nReturn ONLY valid JSON matching the card details." }, { inlineData: { mimeType: 'image/jpeg', data: base64Data } }] }
          ],
          config: {
            responseMimeType: "application/json"
          }
        });
        responseText = fallbackResponse.text;
      } catch (fallbackErr: any) {
        if (isQuotaError(fallbackErr)) {
          return res.status(429).json({ 
            error: "Gemini API daily request quota reached (Free Tier limit: 20 requests/day). Please use manual card search or try again later.",
            code: "QUOTA_EXCEEDED"
          });
        }
        throw fallbackErr;
      }
    }

    if (!responseText) {
      return res.status(500).json({ error: "No response received from Gemini Vision." });
    }

    let parsed = JSON.parse(responseText);

    // Look up canonical card info & market prices from Pokemon TCG API
    try {
      const cleanName = (parsed.name || "").replace(/[^a-zA-Z0-9 -]/g, "");
      const cleanNum = (parsed.cardNumber || "").split('/')[0].replace(/[^0-9A-Za-z]/g, "");
      
      let tcgData: any = { data: [] };
      
      if (cleanName) {
        // Strategy 1: Name and Number
        if (cleanNum) {
          const query1 = `name:"${cleanName}" number:"${cleanNum}"`;
          const tcgRes = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query1)}`, {
            headers: { 'User-Agent': 'PokeVault-AI', 'Accept': 'application/json' }
          });
          if (tcgRes.ok) tcgData = await tcgRes.json();
        }

        // Strategy 2: If no matches, Name and Set
        if (!tcgData.data || tcgData.data.length === 0) {
           const query2 = `name:"${cleanName}" set.name:"${(parsed.set || "").replace(/[^a-zA-Z0-9 -]/g, "")}"`;
           const tcgRes = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query2)}`, {
             headers: { 'User-Agent': 'PokeVault-AI', 'Accept': 'application/json' }
           });
           if (tcgRes.ok) tcgData = await tcgRes.json();
        }

        // Strategy 3: Just Name
        if (!tcgData.data || tcgData.data.length === 0) {
           const query3 = `name:"${cleanName}"`;
           const tcgRes = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query3)}&pageSize=10`, {
             headers: { 'User-Agent': 'PokeVault-AI', 'Accept': 'application/json' }
           });
           if (tcgRes.ok) tcgData = await tcgRes.json();
        }

        if (tcgData.data && tcgData.data.length > 0) {
          // Programmatic candidate matching (0 extra Gemini API calls!)
          let bestMatch = tcgData.data[0];
          if (tcgData.data.length > 1 && cleanNum) {
            const numMatch = tcgData.data.find((c: any) => c.number && String(c.number).toLowerCase() === cleanNum.toLowerCase());
            if (numMatch) bestMatch = numMatch;
          }

          parsed.name = bestMatch.name || parsed.name;
          if (bestMatch.set) {
            parsed.set = bestMatch.set.name || parsed.set;
          }
          parsed.cardNumber = bestMatch.number || parsed.cardNumber;
          parsed.rarity = bestMatch.rarity || parsed.rarity;
          
          if (bestMatch.images) {
            parsed.imageUrl = bestMatch.images.large || bestMatch.images.small || parsed.imageUrl;
          }
          
          if (bestMatch.tcgplayer && bestMatch.tcgplayer.prices) {
            const prices = bestMatch.tcgplayer.prices;
            const priceType = prices.holofoil || prices.reverseHolofoil || prices.normal || Object.values(prices)[0];
            if (priceType) {
              parsed.lowPrice = priceType.low || parsed.lowPrice;
              parsed.medianPrice = priceType.mid || parsed.medianPrice;
              parsed.highPrice = priceType.high || parsed.highPrice;
              parsed.sourceUrl = bestMatch.tcgplayer.url || parsed.sourceUrl;
              
              parsed.sources = parsed.sources || [];
              const existingIndex = parsed.sources.findIndex((s: any) => s.name === 'TCGPlayer');
              const newSource = {
                name: 'TCGPlayer',
                url: bestMatch.tcgplayer.url,
                price: priceType.mid || priceType.market || 0,
                type: 'API'
              };
              if (existingIndex >= 0) {
                parsed.sources[existingIndex] = newSource;
              } else {
                parsed.sources.push(newSource);
              }
            }
          }
        }
      }
    } catch (tcgErr) {
      console.warn("TCG API lookup failed, using Gemini response", tcgErr);
    }

    res.json(parsed);

  } catch (error: any) {
    console.error("Error scanning card:", error);
    if (isQuotaError(error)) {
      return res.status(429).json({ 
        error: "Gemini API daily request quota reached (Free Tier limit: 20 requests/day). Please wait before scanning again, or use manual card search.",
        code: "QUOTA_EXCEEDED"
      });
    }

    const errorMessage = error?.message || "Failed to scan card. Please try again.";
    res.status(500).json({ error: errorMessage });
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

