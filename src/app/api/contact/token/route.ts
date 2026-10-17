import { NextResponse } from "next/server";
import { getSecret } from "@/lib/contact/config";
import { createToken } from "@/lib/contact/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Liefert ein signiertes Zeit-Token für das Formular (kein Cookie, keine Speicherung). */
export function GET() {
  return NextResponse.json({ token: createToken(getSecret()) }, { headers: { "Cache-Control": "no-store" } });
}
