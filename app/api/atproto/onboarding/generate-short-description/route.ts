import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      longDescription?: string;
      organizationName?: string;
    };

    // Simulate a small delay to mimic AI processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For now, return a fixed placeholder text
    // In production, this would call an AI service to generate a summary
    const shortDescription =
      "A dedicated organization committed to environmental conservation and sustainable development. We work to protect natural ecosystems, promote biodiversity, and empower local communities through innovative green initiatives.";

    return new Response(
      JSON.stringify({
        shortDescription,
        success: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error generating short description:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to generate description",
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
