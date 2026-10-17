import { NextResponse } from "next/server";
import { handleContact } from "@/lib/contact/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { status, body, headers } = await handleContact(request);
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

// Alles andere ist nicht erlaubt.
export function GET() {
  return new NextResponse(null, { status: 405, headers: { Allow: "POST" } });
}
