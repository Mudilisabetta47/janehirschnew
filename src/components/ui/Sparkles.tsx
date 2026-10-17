/** Dezentes Funkeln im Hintergrund (rein dekorativ, CSS, bei reduzierter Bewegung statisch). */
const spots = [
  { x: "8%", y: "18%", s: 10, d: 0 },
  { x: "22%", y: "72%", s: 7, d: 1.2 },
  { x: "38%", y: "30%", s: 12, d: 2.1 },
  { x: "55%", y: "82%", s: 8, d: 0.6 },
  { x: "68%", y: "14%", s: 9, d: 1.8 },
  { x: "81%", y: "58%", s: 13, d: 0.3 },
  { x: "92%", y: "28%", s: 7, d: 2.6 },
  { x: "47%", y: "52%", s: 6, d: 3.1 },
];

export function Sparkles({ className = "text-rose" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-[5] overflow-hidden ${className}`}>
      {spots.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="sparkle absolute fill-current"
          style={{ left: p.x, top: p.y, width: p.s * 2, height: p.s * 2, animation: `twinkle ${4 + (i % 3)}s ease-in-out ${p.d}s infinite` }}
        >
          <path d="M12 0c.6 6.4 2.6 10.4 12 12-9.4 1.6-11.4 5.6-12 12-.6-6.4-2.6-10.4-12-12C9.4 10.4 11.4 6.4 12 0z" />
        </svg>
      ))}
    </div>
  );
}

/** Weicher, langsam wandernder Lichtschein (Bokeh-Gefühl). */
export function LightLeak({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`leak pointer-events-none absolute -z-[6] rounded-full blur-3xl [animation:drift_16s_ease-in-out_infinite] ${className}`}
    />
  );
}
