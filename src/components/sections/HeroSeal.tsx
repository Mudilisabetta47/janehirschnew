/** Rotierendes Textsiegel (reines CSS). */
export function HeroSeal({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="relative h-32 w-32 md:h-40 md:w-40">
      <svg viewBox="0 0 160 160" className="h-full w-full animate-spin-slow text-bone">
        <defs>
          <path id="seal-circle" d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0" />
        </defs>
        <circle cx="80" cy="80" r="76" className="fill-mocha/80" />
        <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor" strokeOpacity="0.3" />
        <text fill="currentColor" fontSize="10.5" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase" }}>
          <textPath href="#seal-circle" textLength="384" lengthAdjust="spacing">
            Brautstyling · Coaching · Make-up · Hair ·
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center font-script text-4xl text-rose">J.H.</span>
      </div>
    </div>
  );
}
