type Tone = "bone" | "blush" | "mocha";

const tones: Record<Tone, string> = {
  bone: "bg-bone text-ink",
  blush: "bg-blush text-ink",
  mocha: "bg-mocha text-bone on-dark",
};

export function Section({
  tone = "bone",
  className = "",
  id,
  labelledBy,
  children,
}: {
  tone?: Tone;
  className?: string;
  id?: string;
  labelledBy?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative py-24 md:py-36 ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}
