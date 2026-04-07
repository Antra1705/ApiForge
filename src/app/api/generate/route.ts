import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Define the schema for structured output so we can render it directly
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        schema: {
          type: Type.STRING,
          description: "A valid Prisma schema configuration string modeling the necessary database tables based on the user's prompt.",
        },
        endpoints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              method: {
                type: Type.STRING,
                description: "HTTP Method (e.g. GET, POST, PUT, DELETE).",
              },
              path: {
                type: Type.STRING,
                description: "The API endpoint path (e.g. /api/users).",
              },
              desc: {
                type: Type.STRING,
                description: "A short description of what the endpoint does.",
              },
            },
            required: ["method", "path", "desc"],
          },
          description: "A list of standard REST endpoints needed for the application based on the user's prompt.",
        },
      },
      required: ["schema", "endpoints"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: `You are an expert AI backend architect. Based on the user's application description, generate the core database schema (in Prisma format) and the primary REST API endpoints. \n\nApp Description: ${prompt}` }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const resultText = response.text || "{}";
    const resultObj = JSON.parse(resultText);

    return NextResponse.json(resultObj);
  } catch (error: any) {
    console.error("Failed to generate API:", error);
    return NextResponse.json({ error: error.message || "Failed to generate API securely." }, { status: 500 });
  }
}
