import { NextResponse } from "next/server";
import { handleCheckout } from "@/lib/checkout/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { status, body, headers } = await handleCheckout(request);
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export function GET() {
  return new NextResponse(null, { status: 405, headers: { Allow: "POST" } });
}
