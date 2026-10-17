import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { ClearCartOnSuccess } from "@/components/cart/ClearCartOnSuccess";

export const metadata = { title: "Danke für deine Buchung", robots: { index: false, follow: false } };

export default function BookingSuccessPage() {
  return (
    <PageHero
      eyebrow="Buchung eingegangen"
      title={"Danke dir –\nbis bald!"}
      lead="Deine Zahlung ist bei Stripe angekommen. Die Rechnung bekommst du per E-Mail. Ich melde mich persönlich bei dir, um den Termin abzustimmen."
      backdrop="Danke"
    >
      <ClearCartOnSuccess />
      <ButtonLink href="/">Zur Startseite</ButtonLink>
    </PageHero>
  );
}
