import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    provider: null,
    status: "not_configured",
    message:
      "Tide data needs a tide provider API key such as WorldTides or UKHO/ADMIRALTY.",
    highTides: [],
    lowTides: [],
  });
}