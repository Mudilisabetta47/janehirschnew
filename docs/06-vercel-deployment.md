# 06 · Vercel-Einrichtung (Konto, Projekt, Turso, Umgebungsvariablen)

> Stand 19.10.2026. Menünamen in Vercel/Turso/Stripe können sich leicht ändern – im Zweifel der Oberfläche folgen.
> **Nichts davon schaltet die Live-Seite um.** Zuerst entsteht eine Staging-Adresse `https://<projekt>.vercel.app`. Domain, DNS und Abschalten der WordPress-Seite folgen erst nach ausdrücklicher Freigabe (Schritt 9).

## 0 · Vorab
- **Passwort-Hash fürs Backend** erzeugen (Passwort bleibt bei dir): `npm run admin:hash` → die Zeile `ADMIN_PASSWORD_HASH="…"` merken.
- **Zufallswert** für `FORM_SECRET`: `openssl rand -hex 32`.
- **Stripe nur Testmodus** (`sk_test_…`) für Staging.

## 1 · Code in ein privates Git-Repository
1. Auf GitHub (oder GitLab/Bitbucket) ein **privates** Repository anlegen, z. B. `jane-hirsch-website`.
2. Im Projektordner verbinden und hochladen (die Dateien `.env.local` und `data/` sind per `.gitignore` ausgeschlossen – es gehen keine Geheimnisse raus):
   ```bash
   git remote add origin <URL-des-Repositorys>
   git push -u origin main
   ```

## 2 · Vercel-Konto
1. `vercel.com/signup` → Anmeldung mit GitHub.
2. **Pro-Plan** wählen (bzw. ein Team mit Pro): Der Hobby-Plan ist laut Vercel nur für nicht-kommerzielle Nutzung. Preis laut Preisseiten ca. 20 $ pro Nutzer und Monat plus Verbrauch – aktuell auf vercel.com/pricing prüfen.
3. Unter *Settings → Billing → Spend Management* ein **Ausgabenlimit** setzen.

## 3 · Projekt importieren
1. *Add New → Project* → das Repository wählen. Framework „Next.js“ wird erkannt, Root-Verzeichnis bleibt das Repo-Stammverzeichnis, Build-/Output-Einstellungen unverändert lassen.
2. *Settings → General → Node.js Version*: **22.x oder höher**.
3. Die Funktionsregion **Frankfurt (`fra1`)** kommt aus `vercel.json`.
4. Beim ersten Import noch **nicht** deployen, sondern zuerst Schritt 4 und 5 erledigen (oder den ersten Fehlversuch einfach durch einen Redeploy ersetzen).

## 4 · Turso-Datenbank (Anfragen & Bestellungen)
1. Im Vercel-Projekt: *Storage* (bzw. *Integrations → Marketplace*) → **Turso Cloud** → *Create Database*.
2. **Region in Europa** wählen (möglichst Frankfurt/Irland), Datenbank mit dem Projekt verbinden.
3. Vercel trägt `TURSO_DATABASE_URL` und `TURSO_AUTH_TOKEN` automatisch ein – die App erkennt sie. Die Tabellen legt die App beim ersten Aufruf selbst an, es ist nichts zu importieren.

## 5 · Umgebungsvariablen (*Settings → Environment Variables*)
Geheimnisse als **Sensitive** markieren. Werte ohne Anführungszeichen einfügen.

| Variable | Wert | Hinweis |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://<projekt>.vercel.app` | später die echte Domain |
| `SITE_NOINDEX` | `true` | bis zum Livegang! |
| `FORM_SECRET` | Zufallswert (Schritt 0) | min. 32 Zeichen |
| `ADMIN_PASSWORD_HASH` | `scrypt:…` (Schritt 0) | Backend `/admin` |
| `TRUST_PROXY` | `true` | Vercel überschreibt `X-Forwarded-For` |
| `CONTACT_TO` | Empfängeradresse | noch von Jane bestätigen lassen |
| `CONTACT_FROM` | Absender, z. B. `Website jane-hirsch.de <info@jane-hirsch.de>` | muss ein IONOS-Postfach sein |
| `SMTP_HOST` / `SMTP_PORT` | `smtp.ionos.de` / `587` | Port 25 ist auf Vercel gesperrt |
| `SMTP_USER` / `SMTP_PASS` | IONOS-Postfach | Passwort nur hier eintragen |
| `MAIL_SEND_ENABLED` | `false` | erst nach Freigabe `true` |
| `STRIPE_SECRET_KEY` | `sk_test_…` | **Testmodus** |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | aus Schritt 7 |
| `NEXT_PUBLIC_CHECKOUT_ENABLED` | `true` | Build-Variable → nach Änderung **neu deployen** |
| `RETENTION_INQUIRY_DAYS` | `180` (optional) | Löschfrist erledigter Anfragen |
| `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | automatisch | aus Schritt 4 |

## 6 · Deployen und prüfen
1. *Deploy* (bzw. *Redeploy*).
2. `https://<projekt>.vercel.app/admin/login` öffnen → anmelden → unten den **Bereitschafts-Check** lesen. Er zeigt ehrlich, was noch fehlt.
3. Kontaktformular einmal mit einer Testnachricht absenden → sie erscheint im Backend unter *Anfragen* (Mail bleibt im Trockenlauf, solange `MAIL_SEND_ENABLED=false`).

## 7 · Stripe-Testwebhook
1. Stripe Dashboard (Testmodus) → *Entwickler → Webhooks → Endpunkt hinzufügen*: `https://<projekt>.vercel.app/api/stripe/webhook`.
2. Ereignisse: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `charge.refunded`.
3. Das **Signing-Secret** (`whsec_…`) als `STRIPE_WEBHOOK_SECRET` eintragen → *Redeploy*.
4. Testkauf mit der Stripe-Testkarte `4242 4242 4242 4242`. Die Bestellung erscheint im Backend unter *Bestellungen*.
5. Falls Stripe die Adresse nicht erreicht: *Settings → Deployment Protection* prüfen. Vorschau-Deployments können durch Vercel-Login geschützt sein; die Produktions-Adresse `*.vercel.app` ist normalerweise öffentlich.

## 8 · Rechtliches (vor Livegang)
- **Auftragsverarbeitung (AVV/DPA)** mit Vercel **und** Turso abschließen bzw. bestätigen (beide US-Anbieter; Drittlandübermittlung über EU-US Data Privacy Framework/Standardvertragsklauseln).
- **Datenschutzerklärung** anpassen: Hosting-Abschnitt auf Vercel (Region Frankfurt) und Turso statt IONOS (siehe Hinweis im Entwurf unter `/datenschutz`). Rechtsprüfung nicht vergessen.

## 9 · Livegang – nur nach ausdrücklicher Freigabe
1. Domain in Vercel hinzufügen (*Settings → Domains*), DNS-Einträge wie angezeigt setzen. **Mail-Einträge (MX/SPF) der Domain nicht ändern.**
2. `NEXT_PUBLIC_SITE_URL` auf die echte Domain, `SITE_NOINDEX=false`, `MAIL_SEND_ENABLED=true` (eine einzelne Testmail), Stripe **Live-Schlüssel** und neuer **Live-Webhook** → *Redeploy*.
3. Weiterleitungen alter WordPress-URLs sind bereits eingebaut (`docs/03-redirects.md`); nach dem Umzug stichprobenartig prüfen.
4. Erst danach die alte WordPress-Seite abschalten, Search Console informieren.

## Grenzen
- Das Rate-Limit liegt im Arbeitsspeicher der jeweiligen Serverless-Instanz – für ein kleines Formular ausreichend, für Massenmissbrauch zusätzlich Vercel-Firewall/WAF-Regeln oder Upstash nutzen.
- Die Remote-Anbindung an Turso (`libsql://`) nutzt denselben Client und dasselbe SQL wie die lokale Datei, wurde aber ohne Turso-Konto **nicht** gegen eine echte Datenbank getestet. Der erste Test im Staging (Schritt 6) ist deshalb wichtig.
