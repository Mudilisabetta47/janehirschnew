#!/usr/bin/env bash
# Einmalige Einrichtung auf einem Ubuntu-VPS (22.04/24.04). Als root bzw. mit sudo ausführen:
#   sudo DEPLOY_USER=<dein-ssh-benutzer> bash setup-server.sh
#
# Was das Skript tut:   Node.js (privat unter /srv/jane-hirsch/node), Dienstbenutzer "jane", Ordner unter /srv/jane-hirsch,
#                       systemd-Dienst (Port 3110, nur lokal), tägliches Backup der Datenbank.
# Was es NICHT tut:     Caddy/nginx/Apache/Docker anfassen, Firewall ändern, Zertifikate holen, den Dienst starten
#                       (er startet erst nach dem ersten Deploy), bestehende Dienste verändern.
set -euo pipefail

if [[ $EUID -ne 0 ]]; then echo "Bitte mit sudo/root ausführen." >&2; exit 1; fi
DEPLOY_USER="${DEPLOY_USER:-}"
if [[ -z "$DEPLOY_USER" ]] || ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  echo "DEPLOY_USER fehlt oder existiert nicht (z. B. DEPLOY_USER=ubuntu)." >&2; exit 1
fi
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE=/srv/jane-hirsch
PORT=3110

echo "==> Pakete (nur curl, rsync, sqlite3 – keine fremden Paketquellen)"
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y curl ca-certificates rsync sqlite3 xz-utils

echo "==> Dienstbenutzer und Ordner"
id jane >/dev/null 2>&1 || useradd --system --create-home --home-dir /var/lib/jane --shell /usr/sbin/nologin jane
mkdir -p "$BASE/app" "$BASE/data" "$BASE/backups"
chown -R jane:jane "$BASE"
chmod 750 "$BASE" "$BASE/data" "$BASE/backups"

NODE_VERSION="${NODE_VERSION:-24.11.0}"
if [[ ! -x "$BASE/node/bin/node" ]]; then
  echo "==> Node.js $NODE_VERSION nur für dieses Projekt nach $BASE/node (systemweit wird nichts installiert)"
  arch="$(dpkg --print-architecture)"; case "$arch" in amd64) narch=x64;; arm64) narch=arm64;; *) echo "Architektur $arch nicht unterstützt" >&2; exit 1;; esac
  tmp="$(mktemp -d)"
  curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${narch}.tar.xz" -o "$tmp/node.tar.xz"
  curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt" -o "$tmp/SHASUMS256.txt"
  (cd "$tmp" && grep " node-v${NODE_VERSION}-linux-${narch}.tar.xz\$" SHASUMS256.txt | sed "s# node-v.*# node.tar.xz#" | sha256sum -c -)
  mkdir -p "$BASE/node"; tar -xJf "$tmp/node.tar.xz" -C "$BASE/node" --strip-components=1
  rm -rf "$tmp"; chown -R jane:jane "$BASE/node"
fi
"$BASE/node/bin/node" -v

echo "==> Umgebungsdatei (nur anlegen, wenn noch nicht vorhanden)"
if [[ ! -f "$BASE/.env" ]]; then
  install -o root -g jane -m 640 "$HERE/env.production.example" "$BASE/.env"
  echo "    $BASE/.env angelegt – BITTE ausfüllen (sudo nano $BASE/.env)."
fi

echo "==> Deploy-Berechtigung für $DEPLOY_USER (nur: als 'jane' arbeiten, Dienst neu starten)"
cat > /etc/sudoers.d/jane-hirsch-deploy <<SUDO
$DEPLOY_USER ALL=(jane) NOPASSWD: ALL
$DEPLOY_USER ALL=(root) NOPASSWD: /usr/bin/systemctl restart jane-hirsch, /usr/bin/systemctl status jane-hirsch, /usr/bin/systemctl start jane-hirsch, /usr/bin/systemctl stop jane-hirsch, /usr/bin/journalctl -u jane-hirsch *
SUDO
chmod 440 /etc/sudoers.d/jane-hirsch-deploy
visudo -cf /etc/sudoers.d/jane-hirsch-deploy

echo "==> systemd-Dienst und Backup-Timer"
install -m 644 "$HERE/jane-hirsch.service" /etc/systemd/system/jane-hirsch.service
install -m 755 "$HERE/backup.sh" /usr/local/bin/jane-hirsch-backup
install -m 644 "$HERE/jane-hirsch-backup.service" /etc/systemd/system/jane-hirsch-backup.service
install -m 644 "$HERE/jane-hirsch-backup.timer" /etc/systemd/system/jane-hirsch-backup.timer
systemctl daemon-reload
systemctl enable jane-hirsch.service jane-hirsch-backup.timer >/dev/null
systemctl start jane-hirsch-backup.timer

cat <<DONE

Fertig. Nächste Schritte:
  1) sudo nano $BASE/.env          (Werte eintragen, siehe docs/07-vps-deployment.md)
  2) Auf deinem Mac:  VPS_HOST=<ssh-ziel> deploy/vps/deploy.sh
  3) Test per SSH-Tunnel:  ssh -L 3110:127.0.0.1:$PORT <ssh-ziel>   → http://localhost:3110
Caddy/Docker/Firewall wurden NICHT verändert. Vorlage für den Caddy-Block: deploy/vps/Caddyfile-jane-hirsch.snippet.
DONE
