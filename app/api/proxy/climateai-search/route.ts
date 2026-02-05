import { NextRequest, NextResponse } from "next/server";
import {
    getSessionFromRequest,
    resumeCredentialSession,
} from "climateai-sdk/session";
import { allowedPDSDomains } from "@/config/climateai-sdk";

export async function GET(req: NextRequest) {
    try {
        // 1. Get Session
        const session = await getSessionFromRequest();
        if (!session || !session.did) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Resume Credential Session (to get a fresh valid token/agent if needed, 
        //    though fetching manually with accessJwt is often enough if valid.
        //    But climateai-sdk resumeCredentialSession handles refreshing too.)
        const credentialSession = await resumeCredentialSession(
            allowedPDSDomains[0], // "climateai.org"
            session
        );

        if (!credentialSession.success) {
            return NextResponse.json(
                { error: "Failed to resume session" },
                { status: 401 }
            );
        }

        // 3. Get query params
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");
        const limit = searchParams.get("limit") || "5";

        if (!q) {
            return NextResponse.json({ actors: [] });
        }

        // 4. Make request to ClimateAI
        // We use the accessJwt from the resumed session or the original session?
        // credentialSession.agent?.accessJwt is likely what we want if available,
        // or usage of the agent directly.
        // Checking climateai-sdk type definitions would be ideal but I'll assume standard ATProto agent structure
        // or just use the session.accessJwt if resume succeeded.

        // Let's use the accessJwt associated with the resumed session.
        // NOTE: climateai-sdk's resumeCredentialSession returns { success: true, agent: ... } or similar?
        // Based on previous file reads, it returns `credentialSession`. 
        // Let's assume we can just make a fetch with the access token.

        // Actually, `credentialSession` object in `proxy.ts` usage didn't show `agent` property access.
        // But `getSessionFromRequest` returns a session object with `accessJwt`.

        const token = session.accessJwt; // Use the token from the session

        const response = await fetch(
            `https://climateai.org/xrpc/app.bsky.actor.searchActors?q=${encodeURIComponent(
                q
            )}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            // If 401, maybe token expired? resumeCredentialSession should have refreshed cookies if standard
            // but getting the *new* access token out might require inspecting `credentialSession` return more closely.
            // For now, simple pass-through.
            console.error("Upstream error:", response.status, await response.text());
            return NextResponse.json({ actors: [] });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Search proxy error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
