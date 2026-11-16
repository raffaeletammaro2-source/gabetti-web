#!/usr/bin/env bash
# Prepara la cartella _site/ pubblicata da Netlify.
set -euo pipefail
rm -rf _site
mkdir -p _site

# Sito principale alla radice del dominio: app React (Vite) importata da Lovable, va costruita.
if [ -f sito/package.json ]; then
  (
    cd sito
    npm ci --no-audit --no-fund || npm install --no-audit --no-fund
    npm run build
  )
  cp -R sito/dist/. _site/
fi

# Landing dei cantieri: /cantieri/<slug>/ (HTML statico, non passa dalla build di React)
cp -R cantieri _site/cantieri
# Elementi comuni: /shared/
cp -R shared _site/shared
# I README non vanno online
find _site -name 'README.md' -delete
echo "Build completata: $(find _site -type f | wc -l) file"
