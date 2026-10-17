import { rating } from "@/content/rating";

const Star = ({ filled }: { filled: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-5 w-5 ${filled ? "text-[#e8b93c]" : "text-current opacity-25"}`} fill="currentColor">
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8L12 2.5z" />
  </svg>
);

/** Sterne + Wert + Anzahl. `size="lg"` für die Bewertungs-Sektion. */
export function StarRating({ size = "sm", className = "" }: { size?: "sm" | "lg"; className?: string }) {
  const full = Math.round(rating.score);
  const label = `${rating.score.toLocaleString("de-DE", { minimumFractionDigits: 1 })} von 5 Sternen, ${rating.count} ${rating.platform}-Bewertungen`;
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} role="img" aria-label={label}>
      <span className={`flex ${size === "lg" ? "gap-1.5 [&_svg]:h-8 [&_svg]:w-8 md:[&_svg]:h-10 md:[&_svg]:w-10" : "gap-0.5"}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} filled={n <= full} />
        ))}
      </span>
      <span className={size === "lg" ? "font-display text-5xl font-light md:text-6xl" : "text-sm"}>
        {rating.score.toLocaleString("de-DE", { minimumFractionDigits: 1 })}
        <span className={size === "lg" ? "ml-3 font-sans text-base text-muted" : "ml-1.5 opacity-75"}>({rating.count})</span>
      </span>
    </div>
  );
}
