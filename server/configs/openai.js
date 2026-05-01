import { GoogleGenAI } from "@google/genai";

let ai = null;

const getGeminiAI = () => {
    if (!ai) {
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }
    return ai;
};

export default getGeminiAI;