#!/usr/bin/env bash
# Einmalige Einrichtung auf einem Ubuntu-VPS (22.04/24.04). Als root bzw. mit sudo ausführen:
#   sudo DEPLOY_USER=<dein-ssh-benutzer> bash setup-server.sh
#
# Was das Skript tut:   Node.js 24, Dienstbenutzer "jane", Ordner unter /srv/jane-hirsch,
#                       systemd-Dienst (Port 3110, nur lokal), tägliches Backup der Datenbank.
# Was es NICHT tut:     nginx/Apache anfassen, Firewall ändern, Zertifikate holen, den Dienst starten
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

echo "==> Pakete (curl, rsync, sqlite3, build-essential)"
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y curl ca-certificates gnupg rsync sqlite3 build-essential

if ! command -v node >/dev/null 2>&1 || [[ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]]; then
  echo "==> Node.js 24 (NodeSource)"
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
fi
echo "Node: $(node -v)  npm: $(npm -v)"

echo "==> Dienstbenutzer und Ordner"
id jane >/dev/null 2>&1 || useradd --system --create-home --home-dir /var/lib/jane --shell /usr/sbin/nologin jane
mkdir -p "$BASE/app" "$BASE/data" "$BASE/backups"
chown -R jane:jane "$BASE"
chmod 750 "$BASE" "$BASE/data" "$BASE/backups"

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
nginx wurde NICHT verändert. Einen Konfigurationsblock findest du in deploy/vps/nginx-jane-hirsch.conf.
DONE
