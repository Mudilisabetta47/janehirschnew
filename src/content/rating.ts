/**
 * Bewertung (Google). Quelle: Screenshot des Google-Unternehmensprofils, vom Auftraggeber am
 * 17.10.2026 bereitgestellt: „Jane Hirsch | Hochzeitsstyling Bremen“, 5,0 Sterne, 46 Bewertungen.
 *
 * Achtung: Das Profil gehört zum Hochzeitsstyling-Angebot (Bräute), nicht zu den Coachings.
 * Die Anzeige benennt deshalb die Quelle. Zahl und Datum regelmäßig aktualisieren; nicht als
 * strukturierte Daten (AggregateRating) ausgeben – selbst eingebundene Bewertungen sind dafür tabu.
 */
export const rating = {
  score: 5.0,
  count: 46,
  platform: "Google",
  profile: "Jane Hirsch | Hochzeitsstyling Bremen",
  asOf: "17.10.2026",
} as const;
