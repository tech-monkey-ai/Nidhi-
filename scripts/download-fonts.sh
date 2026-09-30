#!/usr/bin/env bash
# Download all premium fonts for Nidhi (Onest, Inter, Noto Devanagari, Noto Kannada)
set -e
cd "$(dirname "$0")/.."
mkdir -p assets/fonts
cd assets/fonts
rm -f *.ttf

UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"

dl_from_css() {
  local family="$1" weights="$2" prefix="$3"
  local css
  css=$(curl -sLA "$UA" "https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap")
  echo "$css" | grep -oE "url\([^)]+\)" | sed 's/url(//; s/)//' | while read -r url; do
    # Determine weight from preceding comment? We just download sequentially.
    echo "$url"
  done
}

# Download each weight explicitly so we can name files correctly
fetch() {
  local family="$1" weight="$2" outname="$3"
  local css url
  css=$(curl -sLA "$UA" "https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap")
  url=$(echo "$css" | grep -oE "url\([^)]+\)" | head -1 | sed 's/url(//; s/)//')
  if [ -z "$url" ]; then echo "FAILED: $family w=$weight"; return 1; fi
  curl -sL "$url" -o "$outname"
  echo "  $outname  ($(stat -c%s "$outname") bytes)"
}

echo "==> Onest"
fetch "Onest"            400 "Onest-Regular.ttf"
fetch "Onest"            500 "Onest-Medium.ttf"
fetch "Onest"            600 "Onest-SemiBold.ttf"
fetch "Onest"            700 "Onest-Bold.ttf"
fetch "Onest"            800 "Onest-ExtraBold.ttf"

echo "==> Inter (numerics)"
fetch "Inter"            400 "Inter-Regular.ttf"
fetch "Inter"            600 "Inter-SemiBold.ttf"
fetch "Inter"            700 "Inter-Bold.ttf"
fetch "Inter"            800 "Inter-ExtraBold.ttf"

echo "==> Noto Sans Devanagari"
fetch "Noto+Sans+Devanagari" 400 "NotoSansDevanagari-Regular.ttf"
fetch "Noto+Sans+Devanagari" 600 "NotoSansDevanagari-SemiBold.ttf"
fetch "Noto+Sans+Devanagari" 700 "NotoSansDevanagari-Bold.ttf"

echo "==> Noto Sans Kannada"
fetch "Noto+Sans+Kannada"   400 "NotoSansKannada-Regular.ttf"
fetch "Noto+Sans+Kannada"   600 "NotoSansKannada-SemiBold.ttf"
fetch "Noto+Sans+Kannada"   700 "NotoSansKannada-Bold.ttf"

echo
echo "==> Verifying..."
for f in *.ttf; do
  type=$(file -b "$f" | head -c 30)
  size=$(stat -c%s "$f")
  echo "  $f  ${size}B  ${type}"
done
