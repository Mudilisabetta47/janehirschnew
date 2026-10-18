import { z } from "zod";

/**
 * Zod 4 versucht standardmäßig, Prüfer per `new Function` (eval) zu beschleunigen. Unsere
 * Content-Security-Policy erlaubt kein eval; Firefox meldet den Versuch als Fehler in der Konsole.
 * `jitless` schaltet das ab – für unsere kleinen Formulare ohne Geschwindigkeitsverlust.
 */
z.config({ jitless: true });
