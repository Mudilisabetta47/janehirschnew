/**
 * Teilnehmer-Stimmen.
 *
 * Im Bestand existieren nur Stern-Grafiken ohne Text. Es werden keine Zitate
 * erfunden: Solange dieses Array leer ist, rendert die Komponente `Testimonials`
 * nichts. Echte Stimmen (mit Einverständnis der Teilnehmer:innen) hier eintragen:
 *
 *   { quote: "…", author: "Vorname, Beruf", service: "gruppencoaching" }
 */
export type Testimonial = { quote: string; author: string; service?: string };

export const testimonials: Testimonial[] = [];
