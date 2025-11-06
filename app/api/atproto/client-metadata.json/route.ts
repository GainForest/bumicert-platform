import { NextResponse } from "next/server";
import { generateClientMetadata } from "./action";

export async function GET() {
  const metadata = generateClientMetadata();

  return NextResponse.json(metadata);
}
