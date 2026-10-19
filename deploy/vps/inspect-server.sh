#!/usr/bin/env bash
# NUR LESEND: zeigt Struktur, nginx, Dienste, Ports und Ressourcen des Servers. Ändert nichts.
# Aufruf vom Mac:  ssh ingadmin@31.70.150.48 'bash -s' < deploy/vps/inspect-server.sh > server-befund.txt
# (Passwörter/Schlüssel werden nicht ausgegeben; nginx-Dateien nur als Liste bzw. server_name/listen/proxy_pass-Zeilen.)
set +e
S() { echo; echo "=== $* ==="; }
S "System";    . /etc/os-release; echo "$PRETTY_NAME"; uname -r; uptime; id
S "Ressourcen"; free -h; df -h / /srv /var 2>/dev/null; nproc
S "Offene Ports (nur Listen)"; (ss -tulnH 2>/dev/null || netstat -tuln) | awk '{print $1, $5}' | sort -u
S "Laufende Dienste (systemd)"; systemctl list-units --type=service --state=running --no-legend 2>/dev/null | awk '{print $1}'
S "Prozesse mit Node/PM2/Docker"; ps -eo user,pid,pcpu,pmem,args --sort=-pmem 2>/dev/null | grep -Ei 'node|next|pm2|docker|nginx|apache|php|python|gunicorn' | grep -v grep | cut -c1-160 | head -30
S "Docker"; (docker ps --format '{{.Names}}\t{{.Ports}}' 2>&1 | head -20) || true
S "Webserver-Versionen"; nginx -v 2>&1; apache2 -v 2>&1 | head -1; node -v 2>&1; npm -v 2>&1; sqlite3 --version 2>&1 | head -1
S "nginx: aktive Sites (Dateinamen)"; ls -l /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>&1
S "nginx: server_name / listen / proxy_pass / root (gekürzt, ohne Geheimnisse)"
grep -RHEn '^\s*(server_name|listen|proxy_pass|root)\b' /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null | cut -c1-200 | head -80
S "nginx: Konfig-Test (nur Syntaxprüfung, lädt nichts neu)"; sudo -n nginx -t 2>&1 | head -5
S "Zertifikate (Let's Encrypt)"; (sudo -n ls /etc/letsencrypt/live 2>&1 | head -20); command -v certbot && certbot --version 2>&1
S "Zertifikat-Erneuerung (Timer)"; systemctl list-timers --no-legend 2>/dev/null | grep -Ei 'certbot|acme'
S "Firewall (nur lesen)"; (sudo -n ufw status 2>&1 | head -20)
S "Projekte unter /srv und /var/www (nur Ordnernamen)"; ls -la /srv /var/www 2>&1 | head -40
S "Ist /srv/jane-hirsch oder Benutzer jane schon vorhanden?"; ls -ld /srv/jane-hirsch 2>&1; id jane 2>&1
S "Port 3110 frei?"; ss -tlnH | awk '{print $4}' | grep -E ':3110$' || echo "ja, frei"
S "Auflösung der Domain (DNS, nur Anzeige)"; getent hosts jane-hirsch.de www.jane-hirsch.de; curl -4 -s --max-time 5 https://ifconfig.me 2>/dev/null; echo
S "sudo ohne Passwort möglich?"; sudo -n true 2>&1 | head -1 && echo "sudo-ok"
