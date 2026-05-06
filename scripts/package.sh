#!/usr/bin/env bash
# Build a Chrome Web Store-ready zip from the extension source.
set -euo pipefail

cd "$(dirname "$0")/.."

VERSION=$(python3 -c "import json; print(json.load(open('manifest.json'))['version'])")
OUT_DIR="dist"
OUT="$OUT_DIR/inbox-hidden-v${VERSION}.zip"

mkdir -p "$OUT_DIR"
rm -f "$OUT"

zip -qr "$OUT" \
  manifest.json \
  content.js \
  styles.css \
  icons \
  LICENSE \
  PRIVACY.md \
  -x "*.DS_Store"

echo "wrote $OUT"
unzip -l "$OUT"
