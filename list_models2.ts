import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const models = await ai.models.list();
  const names = models.map(m => m.name).filter(name => name.includes("flash"));
  console.log(names);
}
run();
