import Image from "next/image";
import { images, type SiteImage } from "@/content/images";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Große, randlose Foto-Bahn über die volle Breite: drei Hochformat-Bilder nebeneinander
 * (Smartphone: untereinander). Dazwischen nur 1 px Fuge, beim Hover zoomt das einzelne Bild.
 */
export function PhotoBand({ shots = [images.hero, images.coaching, images.about] }: { shots?: SiteImage[] }) {
  return (
    <section aria-label="Eindrücke aus dem Brautstyling" className="bg-mocha">
      <div className="grid gap-px bg-bone/20 md:grid-cols-3">
        {shots.map((img, i) => (
          <Reveal key={img.src} delay={i * 0.12} y={40} className="group relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-[min(92svh,60rem)]">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width:768px) 34vw, 100vw"
              className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
