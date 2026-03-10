import { GoogleGenAI } from "@google/genai";

export async function getCityInsights(
  cityName: string,
  aqi: number,
  temp: number,
  traffic: number,
  humidity: number
) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      You are an AI City Advisor. Analyze the following real-time data for ${cityName}, India:
      - AQI Level: ${aqi}
      - Temperature: ${temp}°C
      - Traffic Congestion: ${traffic}%
      - Humidity: ${humidity}%
      
      Provide a short, concise analysis and recommendations.
      Format your response with the following sections (use markdown):
      ### City Health Analysis
      ### Lifestyle Recommendations
      ### Outdoor Activity Suggestions
      
      Keep it brief and actionable.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return "AI insights are currently unavailable. Please ensure your API key is configured.";
  }
}
