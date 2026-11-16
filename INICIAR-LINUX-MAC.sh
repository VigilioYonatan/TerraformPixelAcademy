#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Se necesita Node.js 20.19 o superior." >&2
  exit 1
fi
echo "Abre http://localhost:4173 en tu navegador."
exec node scripts/server.mjs
