import Image from "next/image";
import { images, type ImageSlotKey, type SiteImage } from "@/content/images";

type Key = ImageSlotKey;

/**
 * Bildfläche. Zeigt das registrierte, freigegebene Foto – oder (solange keines
 * vorliegt) eine ruhige Tonwert-Komposition, die für sich allein gestaltet ist.
 * Die Fläche selbst wird vom Eltern-Element (z. B. `.arch`) geformt.
 */
export function ImageSlot({
  slot,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority = false,
  tone = "blush",
  className = "",
}: {
  slot: Key;
  sizes?: string;
  priority?: boolean;
  tone?: "blush" | "mocha" | "sand";
  className?: string;
}) {
  const img: SiteImage | null = images[slot] ?? null;
  if (img) {
    return <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} priority={priority} className={`h-full w-full object-cover ${className}`} />;
  }
  const bg =
    tone === "mocha"
      ? "bg-[radial-gradient(120%_90%_at_30%_10%,#4a372f_0%,#2f241f_55%,#241b17_100%)]"
      : tone === "sand"
        ? "bg-[radial-gradient(120%_90%_at_70%_0%,#f5e8e0_0%,#e9d6c8_60%,#d9bfae_100%)]"
        : "bg-[radial-gradient(120%_90%_at_30%_0%,#fff4ee_0%,#f5e8e0_55%,#e9d6c8_100%)]";
  return <div aria-hidden="true" className={`h-full w-full ${bg} ${className}`} />;
}
