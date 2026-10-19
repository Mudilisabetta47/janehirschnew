#!/usr/bin/env bash
# Deployment vom eigenen Rechner auf den VPS (Quellcode hochladen, dort bauen, Dienst neu starten).
# Aufruf:  VPS_HOST=<benutzer>@<server> deploy/vps/deploy.sh
# Voraussetzung: setup-server.sh wurde einmal auf dem Server ausgeführt und /srv/jane-hirsch/.env ist ausgefüllt.
# Es wird nur das Verzeichnis /srv/jane-hirsch angefasst – nginx und andere Dienste bleiben unberührt.
set -euo pipefail

VPS_HOST="${VPS_HOST:?Bitte VPS_HOST setzen, z. B. VPS_HOST=ubuntu@203.0.113.10}"
REMOTE=/srv/jane-hirsch
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

echo "==> 1/4 Prüfungen lokal (Typen, Lint, Tests)"
npm run typecheck
npm run lint
npm test

echo "==> 2/4 Quellcode hochladen (ohne Geheimnisse, Datenbank und node_modules)"
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude data --exclude 'data-*' \
  --exclude '.env*' --exclude .git --exclude .claude --exclude 'next-env.d.ts' --exclude '*.tsbuildinfo' \
  --rsync-path="sudo -u jane rsync" \
  ./ "$VPS_HOST:$REMOTE/app/"

echo "==> 3/4 Abhängigkeiten installieren und bauen (auf dem Server, damit native Module passen)"
ssh "$VPS_HOST" "sudo -u jane bash -lc 'cd $REMOTE/app && set -a && . $REMOTE/.env && set +a && npm ci --no-audit --no-fund && npm run build'"

echo "==> 4/4 Dienst neu starten und prüfen"
ssh "$VPS_HOST" "sudo systemctl restart jane-hirsch"
sleep 5
ssh "$VPS_HOST" "curl -fsS -o /dev/null -w 'Startseite: HTTP %{http_code}\n' http://127.0.0.1:3110/ && curl -fsS -o /dev/null -w 'Backend-Login: HTTP %{http_code}\n' http://127.0.0.1:3110/admin/login"
echo "Fertig. Test per SSH-Tunnel:  ssh -L 3110:127.0.0.1:3110 $VPS_HOST   →  http://localhost:3110"
