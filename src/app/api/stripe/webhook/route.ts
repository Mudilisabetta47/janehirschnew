import { handleStripeWebhook } from "@/lib/checkout/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { status, body } = await handleStripeWebhook(request);
  return new Response(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}
