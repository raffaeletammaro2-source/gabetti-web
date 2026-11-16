#!/usr/bin/env bash
# Prepara la cartella _site/ pubblicata da Netlify.
set -euo pipefail
rm -rf _site
mkdir -p _site
# Sito principale alla radice del dominio (quando ci sarà)
if [ -d sito ] && [ -n "$(ls -A sito 2>/dev/null)" ]; then cp -R sito/. _site/; fi
# Landing dei cantieri: /cantieri/<slug>/
cp -R cantieri _site/cantieri
# Elementi comuni: /shared/
cp -R shared _site/shared
# I README non vanno online
find _site -name 'README.md' -delete
echo "Build completata: $(find _site -type f | wc -l) file"
