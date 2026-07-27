import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const query = `name:"Charizard" number:"4"`;
  const tcgRes = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`);
  const tcgData = await tcgRes.json();
  
  const candidates = tcgData.data.map(c => ({
    id: c.id,
    name: c.name,
    set: c.set.name,
    number: c.number,
    rarity: c.rarity
  }));
  
  console.log(candidates);
}
run();
