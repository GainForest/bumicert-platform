import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "climateai-sdk/session";
import { allowedPDSDomains } from "@/config/climateai-sdk";

export async function GET(req: NextRequest) {
    try {
        const session = await getSessionFromRequest();
        if (!session?.accessJwt) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");
        const limit = searchParams.get("limit") || "5";

        if (!q) {
            return NextResponse.json({ actors: [] });
        }

        const response = await fetch(
            `https://${allowedPDSDomains[0]}/xrpc/app.bsky.actor.searchActors?q=${encodeURIComponent(q)}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessJwt}`,
                },
            }
        );

        if (!response.ok) {
            console.error("Upstream error:", response.status, await response.text());
            return NextResponse.json({ actors: [] });
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error("Search proxy error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
