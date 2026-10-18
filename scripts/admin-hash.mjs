// Erzeugt den Passwort-Hash für das Backend. Das Passwort wird nur lokal eingegeben (nicht angezeigt) und nie gespeichert.
// Aufruf: npm run admin:hash   → Ausgabe nach .env.local / in die Hosting-Umgebung kopieren.
import { createInterface } from "node:readline";
import { hashPassword } from "../src/lib/admin/password.ts";

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
const mute = (rl) => {
  rl._writeToOutput = (s) => {
    if (s.includes("Passwort") || s.includes("\n") || s.includes("\r")) rl.output.write(s);
  };
};
const ask = (q) => new Promise((res) => rl.question(q, res));

mute(rl);
const pw = await ask("Neues Backend-Passwort (mind. 12 Zeichen): ");
const pw2 = await ask("\nPasswort wiederholen: ");
rl.close();
console.log("");
if (pw.length < 12) {
  console.error("Zu kurz – bitte mindestens 12 Zeichen.");
  process.exit(1);
}
if (pw !== pw2) {
  console.error("Die Eingaben stimmen nicht überein.");
  process.exit(1);
}
console.log("Diese Zeile in .env.local bzw. die Hosting-Umgebung eintragen (in Anführungszeichen):\n");
console.log(`ADMIN_PASSWORD_HASH="${hashPassword(pw)}"`);
