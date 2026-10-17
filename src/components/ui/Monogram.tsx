/**
 * Wortmarke „J.H.“ im Kreis – eigene typografische Umsetzung in der Signatur-Schrift
 * der Marke. Das Original-Logo (Handschrift) wird erst nach Freigabe als Vektordatei
 * eingebaut (siehe docs/04-offene-fragen.md).
 */
export function Monogram({ className = "", title = "Jane Hirsch" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={title} className={className} fill="none">
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.2" />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fill="currentColor"
        fontSize="40"
        style={{ fontFamily: "var(--font-script)" }}
      >
        J.H.
      </text>
    </svg>
  );
}
