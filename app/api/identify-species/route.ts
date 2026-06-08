import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "identify-species API is running. Use POST with imageBase64.",
  });
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Missing imageBase64" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a cautious UK marine species identification assistant. Only identify marine animals, seaweed, corals, sponges, crustaceans, molluscs, fish, sharks, rays, seals, dolphins, whales, turtles, jellyfish and other UK sea life. Do not guess confidently. If image quality is poor, return low confidence.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Identify the most likely UK marine species in this image.

Rules:
- Return ONLY valid JSON.
- If unsure, set common_name to "Unknown marine species".
- Confidence must be 0-100.
- Give up to 3 possible candidates.
- Do not identify land animals, insects, people, objects, rocks or random scenery as marine species.

JSON format:
{
  "common_name": string,
  "scientific_name": string | null,
  "confidence": number,
  "notes": string,
  "candidates": [
    {
      "common_name": string,
      "scientific_name": string | null,
      "confidence": number
    }
  ]
}`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const content = result.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return NextResponse.json({
      common_name: parsed.common_name || "Unknown marine species",
      scientific_name: parsed.scientific_name || null,
      confidence: Number(parsed.confidence || 0),
      notes: parsed.notes || "",
      candidates: Array.isArray(parsed.candidates) ? parsed.candidates : [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Identification failed",
        common_name: "Unknown marine species",
        scientific_name: null,
        confidence: 0,
        notes: "Could not identify this image.",
        candidates: [],
      },
      { status: 500 }
    );
  }
}