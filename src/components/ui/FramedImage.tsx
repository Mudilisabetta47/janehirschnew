import type { ReactNode } from "react";

/**
 * Foto mit „Galerie-Rahmen“: Passepartout-Innenrahmen mit Eckzeichen (frame-inset), dahinter ein
 * versetzter Linienrahmen in Rosé und ein weicher Lichtschein. `shape="arch"` für Bogenfenster.
 * Das Kind füllt die Fläche (z. B. next/image mit `fill`).
 */
export function FramedImage({
  children,
  shape = "rect",
  aspect = "aspect-[4/5]",
  className = "",
  caption,
}: {
  children: ReactNode;
  shape?: "rect" | "arch";
  aspect?: string;
  className?: string;
  /** Kleine Signatur-Zeile unter dem Bild (dekorativ) */
  caption?: string;
}) {
  const arch = shape === "arch" ? "arch" : "";
  return (
    <figure className={`relative isolate ${className}`}>
      <div aria-hidden="true" className={`absolute inset-0 -z-10 translate-x-3 translate-y-3 border border-rose-deep/45 md:translate-x-5 md:translate-y-5 ${arch}`} />
      <div aria-hidden="true" className={`absolute -inset-6 -z-20 bg-rose/25 blur-3xl ${arch ? "rounded-full" : ""}`} />
      <div className={`frame-inset relative overflow-hidden bg-blush shadow-[0_40px_80px_-35px_rgb(36_27_23/0.6)] ${aspect} ${arch}`}>{children}</div>
      {caption && (
        <figcaption aria-hidden="true" className="script mt-4 text-center text-4xl text-rose-deep md:text-5xl">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
