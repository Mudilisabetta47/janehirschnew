#!/usr/bin/env bash
# Tägliches Backup der Datenbank (konsistente Kopie per SQLite-Backup), 30 Tage Aufbewahrung.
set -euo pipefail
DB=/srv/jane-hirsch/data/jane.db
OUT=/srv/jane-hirsch/backups
[[ -f "$DB" ]] || { echo "Noch keine Datenbank – nichts zu sichern."; exit 0; }
stamp="$(date +%Y-%m-%d_%H%M)"
sqlite3 "$DB" ".backup '$OUT/jane-$stamp.db'"
gzip -f "$OUT/jane-$stamp.db"
find "$OUT" -name 'jane-*.db.gz' -mtime +30 -delete
echo "Backup: $OUT/jane-$stamp.db.gz"
