# 07 · Betrieb auf dem eigenen VPS (IONOS, Ubuntu 24.04)

> Stand 19.10.2026. Grundlage ist die **lesende** Prüfung des Servers (`deploy/vps/inspect-server.sh`, Ergebnis unten). Bisher wurde auf dem Server **nichts verändert**.
> Der Livegang (Umstellung von `jane-hirsch.de`) erfolgt nur nach ausdrücklicher Freigabe.

## Befund (lesend, 19.10.2026)
| Punkt | Befund | Folge |
|---|---|---|
| System | Ubuntu 24.04.5, 4 CPU, 7,7 GB RAM (≈5,7 GB verfügbar), 205 GB frei, Last ≈ 0,1 | Platz für eine zweite kleine Next.js-App ist da |
| Reverse-Proxy | **Caddy im Docker-Container** (Ports 80/443 + UDP 443 belegt, Container-IP 172.19.0.2). **Kein nginx/Apache auf dem Host** | Der bisherige nginx-Plan entfällt; Jane bekommt einen zusätzlichen **Caddy-Block**. Caddy holt Let's-Encrypt-Zertifikate selbst |
| Andere Projekte | GoKlinik (Next.js, Backend, Postgres, TURN) und ING Studio (`/opt/ing-studio`) laufen in Docker | Dürfen nicht beeinträchtigt werden: keine Änderung an Docker, deren Verzeichnissen, Datenbanken, Firewall |
| Node/sqlite3 auf dem Host | nicht installiert | Node wird **privat** unter `/srv/jane-hirsch/node` abgelegt (kein Eingriff ins System) |
| `/srv`, Benutzer `jane`, Port 3110 | leer / nicht vorhanden / frei | kein Konflikt |
| Rechte von `ingadmin` | Gruppe `sudo`, aber **sudo verlangt Passwort**; kein Docker-Zugriff | Einrichtung braucht eine interaktive Sitzung, in der das sudo-Passwort **du** eingibst; die Caddy-Konfiguration kann ich ohne Docker-Rechte nicht lesen |
| Firewall | ufw-Regeln nicht lesbar (sudo) | Erreichbarkeit Host-Port aus dem Docker-Netz ist **ungeprüft** (siehe Risiko 2) |
| Domain heute | `jane-hirsch.de` und `www` lösen auf **Cloudflare**-Adressen auf | Umstellung = DNS-Eintrag in Cloudflare; kein Zugriff durch mich |

**Sicherheitshinweis zum Server (nicht von mir verursacht):** In der Prozessliste ist ein TURN-Shared-Secret im Klartext als Kommandozeilenargument sichtbar (jeder lokale Benutzer kann es lesen). Besser per Datei/Umgebungsvariable übergeben und das Secret rotieren – das betrifft GoKlinik, ich habe dort nichts geändert.

## Zielarchitektur
```
Browser ──HTTPS──> (Cloudflare, später) ──> Caddy-Container (80/443, bestehend)
                                              └─ neuer Block jane-hirsch.de ──> 172.19.0.1:3110
                                                                                  │ (Docker-Gateway des Caddy-Netzes)
                                       systemd-Dienst "jane-hirsch" (Benutzer jane, Next.js) ── SQLite in /srv/jane-hirsch/data
```
- Eigener Benutzer `jane` ohne Login-Shell, Daten nur in `/srv/jane-hirsch`.
- Dienst lauscht **nicht** auf `0.0.0.0`, sondern nur am Docker-Gateway (`BIND_HOST`) – von außen unerreichbar.
- `Restart=always`, Start beim Booten, nach Docker.

## Deployment-Plan mit Auswirkungen und Rollback
Jede Phase einzeln freigeben. „Auswirkung auf andere Projekte“ = was bestehende Dienste davon merken.

| Phase | Was passiert | Auswirkung auf GoKlinik / ING Studio | Rollback |
|---|---|---|---|
| **0** Lesen (erledigt) | Struktur, Ports, Ressourcen prüfen | keine | – |
| **1** Grundeinrichtung (`setup-server.sh`, mit sudo) | Pakete `curl rsync sqlite3 xz-utils` (apt), Benutzer `jane`, `/srv/jane-hirsch/{app,data,backups,node}`, privates Node, systemd-Dienst + Backup-Timer (Dienst noch **nicht** gestartet), sudoers-Datei für Deploy | keine (neue Pfade/Benutzer; apt-Pakete klein, bestehende Dienste laufen im Docker) | `systemctl disable jane-hirsch jane-hirsch-backup.timer`, Unit-Dateien und `/etc/sudoers.d/jane-hirsch-deploy` löschen, `userdel jane`, `rm -r /srv/jane-hirsch` |
| **2** Erstes Deploy (`deploy.sh`) | Code hochladen, bauen, Dienst starten, nur lokaler Gesundheitstest | Build belastet kurz CPU/RAM (≈1–2 GB, 1–3 min); Server hat Reserve | `systemctl stop jane-hirsch` |
| **3** Ansehen ohne Internet | SSH-Tunnel auf den Dienst, Browser auf `localhost:3110` | keine | Tunnel schließen |
| **4** Öffentliches Staging (optional) | neuer DNS-Eintrag `staging.jane-hirsch.de` → 31.70.150.48 (bei Cloudflare: **nicht** proxied/grau oder Origin-Zertifikat), **Caddy-Block anhängen**, validieren, graceful reload | Reload ist unterbrechungsfrei und lädt bei Fehler nicht; Risiko nur bei fehlerhafter Datei → deshalb Sicherung + `caddy validate` vorher | Block entfernen/Datei zurück, reload; DNS-Eintrag löschen |
| **5** Livegang | Freigabe → Zertifikat, `.env` Produktionswerte, DNS `@`/`www` auf den VPS | keine Änderung an anderen Hosts; **MX/SPF/DKIM bleiben** | DNS auf alten Wert zurück (vorher notieren), WordPress bleibt unangetastet |

### Risiken / Vorbedingungen, die vor Phase 4 geklärt werden müssen
1. **Caddy-Konfiguration lokalisieren:** Wo liegt das Caddyfile (Mount auf dem Host, vermutlich unter `/opt/ing-studio` oder GoKlinik-Verzeichnis) und welcher Container? Ohne Docker-Rechte kann ich das nicht lesen. Ich ändere die Datei erst nach deiner Freigabe, mit Sicherung. Falls das Caddyfile einem anderen Projekt „gehört“, ist die sauberste Variante eine eigene Datei per `import` – das muss der Betreiber entscheiden.
2. **Erreichbarkeit Host ← Container:** Caddy muss `172.19.0.1:3110` erreichen. Bei aktivem ufw wird das oft blockiert; dann braucht es **eine** Regel (z. B. von 172.19.0.0/16 nach Port 3110/tcp). **Das tue ich nur nach ausdrücklicher Freigabe.** Alternative ohne Firewall-Änderung: Jane-App als Docker-Container im Caddy-Netz – das erfordert Docker-Rechte (gleichbedeutend mit Root) und ist nicht Teil dieses Plans.
3. **Docker-Netz prüfen:** Die Gateway-IP `172.19.0.1` ist aus den Listen-Ports abgeleitet. Vor Phase 1 bestätigen (`docker network inspect` durch jemanden mit Docker-Rechten) und `BIND_HOST` in `/srv/jane-hirsch/.env` entsprechend setzen. Ändert sich das Netz nach einem Neustart, startet der Dienst per `Restart=always` erneut.
4. **Zertifikat:** Caddy holt es per HTTP-01, sobald der Name auf den VPS zeigt. Hinter Cloudflare im „proxied“-Modus: SSL-Modus *Full (strict)* verwenden; für einen lückenlosen Wechsel Zertifikat vorher über Staging-Subdomain oder DNS-01 prüfen.
5. **Node-Version:** `setup-server.sh` lädt Node `24.11.0` von nodejs.org und prüft die SHA-256-Summe. Falls diese Version nicht (mehr) existiert, `NODE_VERSION=<aktuelle 24.x>` setzen. Ungetestet.
6. **Skripte ungetestet auf dem Server:** nur `bash -n` geprüft. Deshalb Phase für Phase.
7. **Echte Besucher-IP:** Rate-Limit liest `X-Forwarded-For`; Caddy überschreibt ihn mit der Verbindungs-IP. Steht später Cloudflare davor, entweder `TRUST_PROXY=cloudflare` + Caddy `trusted_proxies cloudflare` oder die Cloudflare-IP-Bereiche beachten – beim Livegang entscheiden.

## Dateien in `deploy/vps/`
| Datei | Zweck |
|---|---|
| `inspect-server.sh` | rein lesende Bestandsaufnahme des Servers |
| `setup-server.sh` | Phase 1 (mit sudo). Fasst Caddy, Docker, Firewall und bestehende Projekte **nicht** an |
| `jane-hirsch.service` | systemd-Dienst, gehärtet (`ProtectSystem=strict`, `NoNewPrivileges`, nur Daten/Cache beschreibbar) |
| `env.production.example` | Vorlage für `/srv/jane-hirsch/.env` (Geheimnisse trägst du selbst ein) |
| `deploy.sh` | Phase 2 und spätere Updates: prüfen, hochladen, bauen, neu starten, Gesundheitstest |
| `backup.sh` + `jane-hirsch-backup.*` | tägliches SQLite-Backup (03:30, 30 Tage) |
| `Caddyfile-jane-hirsch.snippet` | Vorlage für den zusätzlichen Caddy-Block (Staging + auskommentierter Livegang) |

## Befehle
Phase 1 (interaktiv, du gibst das sudo-Passwort ein):
```bash
scp -r deploy/vps ingadmin@31.70.150.48:/tmp/jane-vps
ssh -t ingadmin@31.70.150.48 "sudo DEPLOY_USER=ingadmin bash /tmp/jane-vps/setup-server.sh"
ssh -t ingadmin@31.70.150.48 "sudo nano /srv/jane-hirsch/.env"
```
Pflichtwerte für Staging: `FORM_SECRET` (`openssl rand -hex 32`), `ADMIN_PASSWORD_HASH` (`npm run admin:hash`), `NEXT_PUBLIC_SITE_URL`, `SITE_NOINDEX=true`, `TRUST_PROXY=true`, `BIND_HOST`. `MAIL_SEND_ENABLED=false`, Stripe nur Testmodus. SMTP-Passwort und Stripe-Schlüssel trägst du selbst ein.

Phase 2/3:
```bash
VPS_HOST=ingadmin@31.70.150.48 deploy/vps/deploy.sh
ssh -L 3110:172.19.0.1:3110 ingadmin@31.70.150.48   # dann http://localhost:3110
```

## Betrieb
- **Update:** `deploy.sh` erneut. Die Datenbank in `/srv/jane-hirsch/data` wird nie überschrieben.
- **Backup:** täglich automatisch; Wiederherstellung: Dienst stoppen, `gunzip -c backups/<datei>.gz > data/jane.db`, Besitzer `jane`, Dienst starten. Zusätzlich gelegentlich eine Kopie **außerhalb** des Servers ziehen.
- **Logs:** `sudo journalctl -u jane-hirsch -n 100 --no-pager`.

## Livegang-Checkliste (nur nach ausdrücklicher Freigabe)
1. Inhalte, Rechtstexte (Hosting-Abschnitt: eigener VPS-Anbieter/IONOS, AVV) und `docs/04-offene-fragen.md` erledigt.
2. Caddy-Block für `jane-hirsch.de` und `www` (Vorlage), validieren, graceful reload.
3. `.env`: `NEXT_PUBLIC_SITE_URL=https://jane-hirsch.de`, `SITE_NOINDEX=false`, SMTP, `MAIL_SEND_ENABLED=true` (eine Testmail), Stripe **Live** + Live-Webhook → `deploy.sh`.
4. DNS bei Cloudflare: nur A/AAAA von `@` und `www`. **MX/SPF/DKIM nicht ändern.**
5. Stichproben: Weiterleitungen (`docs/03-redirects.md`), Formular, Testkauf, Search Console.
6. WordPress erst später und separat abschalten.

## Grenzen
- Das Rate-Limit liegt im Speicher des einen Prozesses (reicht für ein kleines Formular; bei Missbrauch zusätzlich Caddy-/fail2ban-Regeln).
- Ein Einzelserver hat keine Ausfallsicherheit; Backup siehe oben.
- Ressourcen werden mit GoKlinik geteilt; bei Engpässen `MemoryMax=` in der Unit setzen.
