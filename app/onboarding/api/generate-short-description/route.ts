/**
 * POST /onboarding/api/generate-short-description
 *
 * Generates a short description using Google Gemini Flash.
 *
 * Usage:
 *   POST /onboarding/api/generate-short-description
 *   Body: { longDescription: string, organizationName: string, country?: string }
 *
 * Responses:
 *   200: { shortDescription: string, success: true }
 *   400: Invalid request body
 *   500: Server error
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { countries } from "@/lib/countries";

const requestSchema = z.object({
  longDescription: z.string().min(50, "Description must be at least 50 characters"),
  organizationName: z.string().min(1, "Organization name is required"),
  country: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = requestSchema.safeParse(await req.json());

    if (!parsed.success) {
      return Response.json(
        {
          error: "BadRequest",
          message: "Invalid request body",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { longDescription, organizationName, country } = parsed.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured");
      return Response.json(
        {
          error: "ServerMisconfigured",
          message: "AI service not configured",
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const countryName = country ? countries[country]?.name : undefined;
    const countryContext = countryName ? ` based in ${countryName}` : "";

    const prompt = `You are a copywriter helping an environmental conservation organization create a short description for their profile.

Organization Name: ${organizationName}${countryContext}

Full Description:
${longDescription}

Write a compelling short description (1-2 sentences, maximum 300 characters) that:
- Captures the organization's core mission and impact
- Is suitable for previews and search results
- Uses active, engaging language
- Does not start with "We" or the organization name
- Does not include any quotation marks in your response

Respond with ONLY the short description, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let shortDescription = response.text().trim();

    // Remove any quotation marks that might have been added
    shortDescription = shortDescription.replace(/^["']|["']$/g, "");

    // Ensure it's not too long
    if (shortDescription.length > 300) {
      shortDescription = shortDescription.substring(0, 297) + "...";
    }

    return Response.json({
      shortDescription,
      success: true,
    });
  } catch (err) {
    console.error("Error generating short description:", err);
    return Response.json(
      {
        error: "GenerationError",
        message:
          err instanceof Error ? err.message : "Failed to generate description",
      },
      { status: 500 }
    );
  }
}
