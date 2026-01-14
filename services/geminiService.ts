
import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseRecord, AIAnalysisResult } from "../types";

export const analyzeDiseaseData = async (records: DiseaseRecord[]): Promise<AIAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze the following individual patient surveillance data and provide a professional public health report.
    Since this is patient-level data (data "by name") from Indonesia, focus on:
    1. Demographics (age/gender) and geographic clusters.
    2. Summary of clinical symptoms if investigations are completed.
    3. Trends aligned with the Kemenkes RI Epidemiological Calendar (Minggu Epidemiologi).
    4. Three actionable recommendations for clinical management and community containment.
    5. General risk level (Low, Medium, High).
    6. GENERATE A GOOGLE APPS SCRIPT (GAS) that automates tracking for individual patient reports in a spreadsheet (e.g., a function to auto-format rows based on lab status or send an email alert for Positive cases).
    
    Data:
    ${JSON.stringify(records)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          googleAppsScript: { type: Type.STRING },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
        },
        required: ["summary", "recommendations", "googleAppsScript", "riskLevel"]
      }
    }
  });

  return JSON.parse(response.text);
};
