# 07 · Betrieb auf dem eigenen VPS (Ubuntu 22.04/24.04)

> Stand 19.10.2026. Ersetzt `06-vercel-deployment.md` für den Fall „kein Budget für Vercel Pro“. Die App läuft als Node-Prozess hinter dem bereits vorhandenen nginx/Apache; die Datenbank ist eine SQLite-Datei auf dem Server (kein Turso nötig).
> **Nichts davon schaltet die Live-Seite um.** Der Kit legt nur den Ordner `/srv/jane-hirsch`, den Benutzer `jane` und zwei systemd-Dienste an. Bestehende Webserver-Konfigurationen, Firewall, DNS und WordPress bleiben unberührt. Die Umstellung von `jane-hirsch.de` (Schritt 6) erfolgt erst nach ausdrücklicher Freigabe.

## Was im Ordner `deploy/vps/` liegt
| Datei | Zweck |
|---|---|
| `setup-server.sh` | Einmalige Einrichtung auf dem Server (Node 24, Benutzer `jane`, Ordner, systemd, Backup-Timer) |
| `jane-hirsch.service` | systemd-Dienst, lauscht nur auf `127.0.0.1:3110`, läuft ohne Root, gehärtet |
| `env.production.example` | Vorlage für `/srv/jane-hirsch/.env` (alle Variablen) |
| `deploy.sh` | Vom Mac aus: prüfen, hochladen, auf dem Server bauen, Dienst neu starten, Gesundheitstest |
| `backup.sh` + `jane-hirsch-backup.*` | Tägliches Datenbank-Backup (03:30, 30 Tage Aufbewahrung) in `/srv/jane-hirsch/backups` |
| `nginx-jane-hirsch.conf` | Beispiel-Block für den Reverse-Proxy (nur Vorlage, wird nicht automatisch eingebunden) |

## 1 · Voraussetzungen
- SSH-Zugang mit einem Benutzer, der `sudo` darf (hier `ubuntu@<server>` als Platzhalter).
- Freier Port 3110 lokal (Dienst bindet nur an 127.0.0.1, nach außen nicht erreichbar).
- Bei Bedarf Passwort-Hash fürs Backend: `npm run admin:hash` auf dem Mac (Passwort bleibt bei dir).

## 2 · Einmalige Server-Einrichtung
```bash
scp -r deploy/vps ubuntu@<server>:/tmp/jane-vps
ssh ubuntu@<server> "sudo DEPLOY_USER=ubuntu bash /tmp/jane-vps/setup-server.sh"
```
Danach `/srv/jane-hirsch/.env` ausfüllen (Vorlage wird angelegt):
```bash
ssh -t ubuntu@<server> "sudo nano /srv/jane-hirsch/.env"
```
Pflichtwerte für Staging: `FORM_SECRET` (`openssl rand -hex 32`), `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_SITE_URL`, `SITE_NOINDEX=true`, `TRUST_PROXY=true`. `MAIL_SEND_ENABLED` bleibt `false`; Stripe-Schlüssel nur im Testmodus. SMTP-Passwort und Stripe-Schlüssel trägst du selbst ein – sie gehören nicht in den Chat.

## 3 · Erstes Deployment (Staging, ohne öffentliche Adresse)
```bash
VPS_HOST=ubuntu@<server> deploy/vps/deploy.sh
```
Das Skript führt lokal Typprüfung, Lint und Tests aus, lädt den Quellcode hoch (ohne `.env*`, `data/`, `node_modules`), baut auf dem Server, startet den Dienst neu und prüft Startseite und Backend-Login.

**Ansehen per SSH-Tunnel – ohne DNS-Änderung und ohne öffentliche Erreichbarkeit:**
```bash
ssh -L 3110:127.0.0.1:3110 ubuntu@<server>
```
Dann im Browser `http://localhost:3110` und `http://localhost:3110/admin/login` (Bereitschafts-Check im Backend lesen). Hinweis: Das Backend setzt in Produktion ein `Secure`-Cookie; über `http://localhost` akzeptieren Browser das trotzdem.

Logs: `ssh ubuntu@<server> "sudo journalctl -u jane-hirsch -n 100 --no-pager"`.

## 4 · Öffentliche Staging-Adresse (optional)
Nur wenn ein Test von außen nötig ist (z. B. für Stripe-Testwebhook): eigene Subdomain, z. B. `staging.<domain>`, per **neuem** DNS-Eintrag auf den VPS. Dann `nginx-jane-hirsch.conf` mit dieser Subdomain einbinden (Befehle im Kopf der Datei), `nginx -t` vor jedem Reload, Zertifikat mit `certbot`. `NEXT_PUBLIC_SITE_URL` anpassen, `SITE_NOINDEX=true` lassen und neu deployen. Die bestehenden Seiten des Servers bleiben unberührt, solange nur ein neuer `server`-Block hinzukommt.

Stripe-Testwebhook: `https://staging.<domain>/api/stripe/webhook`, Ereignisse `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `charge.refunded`; Signing-Secret als `STRIPE_WEBHOOK_SECRET` eintragen, `sudo systemctl restart jane-hirsch`. Für `NEXT_PUBLIC_CHECKOUT_ENABLED` gilt: Build-Variable → nach Änderung `deploy.sh` erneut ausführen.

## 5 · Betrieb
- **Update:** `deploy.sh` erneut ausführen. Die Datenbank liegt in `/srv/jane-hirsch/data` und wird nie überschrieben.
- **Backup:** automatisch täglich; manuell `sudo systemctl start jane-hirsch-backup`. Wiederherstellung: Dienst stoppen, `gunzip -c backups/<datei>.gz > data/jane.db`, Besitzer `jane`, Dienst starten. Zusätzlich gelegentlich eine Kopie **außerhalb** des Servers ziehen (`scp`), ein Backup auf derselben Platte schützt nicht vor Plattenausfall.
- **Sicherheitsupdates:** `unattended-upgrades` des Servers prüfen; Node-Hauptversion bleibt 24 (NodeSource).
- **Dateirechte:** `.env` gehört `root:jane` (640), ist nur für den Dienst lesbar.

## 6 · Livegang `jane-hirsch.de` – nur nach ausdrücklicher Freigabe
Checkliste, Reihenfolge einhalten:
1. Freigabe von Jane/dir einholen; Inhalte, Rechtstexte (Hosting-Abschnitt in der Datenschutzerklärung auf den eigenen VPS-Anbieter anpassen, AVV mit dem VPS-Anbieter) und `docs/04-offene-fragen.md` abgearbeitet.
2. Zertifikat **vor** der Umstellung besorgen (DNS-01-Challenge oder temporär Staging-Zertifikat), damit es keine Zertifikatslücke gibt.
3. nginx-Block mit `server_name jane-hirsch.de www.jane-hirsch.de` aktivieren, `nginx -t`, reload.
4. `.env`: `NEXT_PUBLIC_SITE_URL=https://jane-hirsch.de`, `SITE_NOINDEX=false`, SMTP-Daten, `MAIL_SEND_ENABLED=true` (eine einzelne Testmail), Stripe **Live**-Schlüssel + neuer Live-Webhook → `deploy.sh`.
5. DNS: nur die A/AAAA-Einträge von `@` und `www` auf den VPS. **MX/SPF/DKIM der Domain nicht ändern** (IONOS-Postfächer laufen weiter).
6. Stichproben der Weiterleitungen (`docs/03-redirects.md`), Kontaktformular, Testkauf, Search Console.
7. WordPress erst später und nur nach separater Entscheidung abschalten.

**Rückweg:** DNS-Einträge wieder auf den alten Wert setzen (vorher notieren). Die alte WordPress-Seite bleibt bis dahin unverändert.

## Optional: Cloudflare davor
Funktioniert (kostenloser Plan reicht). Dann in der `.env` `TRUST_PROXY=cloudflare` setzen (Rate-Limit liest `CF-Connecting-IP`) und den Server per Firewall nur für Cloudflare-Adressen auf 80/443 öffnen, sonst lässt sich der Header fälschen.

## Grenzen
- Das Rate-Limit liegt im Arbeitsspeicher des einen Prozesses (reicht für ein kleines Formular). Bei Massenmissbrauch zusätzlich nginx `limit_req` oder fail2ban.
- Die Skripte wurden lokal nur auf Syntax geprüft (`bash -n`), **nicht** auf einem echten Server ausgeführt. Der erste Lauf (Schritt 2/3) ist der eigentliche Test; deshalb zuerst nur Staging per Tunnel.
- Ein Einzelserver hat keine Ausfallsicherheit: Server-Neustart startet den Dienst automatisch (systemd), ein Plattenausfall nicht – siehe Backup.
