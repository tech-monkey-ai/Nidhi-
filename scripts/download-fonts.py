#!/usr/bin/env python3
"""Download premium open-source fonts for the Nidhi mobile app.

Fonts (all licensed under the SIL Open Font License — safe to bundle):
  - Onest (https://onest.sh) — modern, warm, ultra-legible Latin sans
  - Inter — premium numerics & data displays
  - Noto Sans Devanagari — premium Hindi rendering
  - Noto Sans Kannada — premium Kannada rendering

Outputs: assets/fonts/*.ttf
"""
from __future__ import annotations
import os
import re
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

# Use a legacy UA to force TTF (modern UAs get woff2 from Google Fonts)
UA = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"

FONTS: list[tuple[str, int, str]] = [
    # family, weight, output filename
    ("Onest",                  400, "Onest-Regular.ttf"),
    ("Onest",                  500, "Onest-Medium.ttf"),
    ("Onest",                  600, "Onest-SemiBold.ttf"),
    ("Onest",                  700, "Onest-Bold.ttf"),
    ("Onest",                  800, "Onest-ExtraBold.ttf"),
    ("Inter",                  400, "Inter-Regular.ttf"),
    ("Inter",                  600, "Inter-SemiBold.ttf"),
    ("Inter",                  700, "Inter-Bold.ttf"),
    ("Inter",                  800, "Inter-ExtraBold.ttf"),
    ("Noto Sans Devanagari",   400, "NotoSansDevanagari-Regular.ttf"),
    ("Noto Sans Devanagari",   600, "NotoSansDevanagari-SemiBold.ttf"),
    ("Noto Sans Devanagari",   700, "NotoSansDevanagari-Bold.ttf"),
    ("Noto Sans Kannada",      400, "NotoSansKannada-Regular.ttf"),
    ("Noto Sans Kannada",      600, "NotoSansKannada-SemiBold.ttf"),
    ("Noto Sans Kannada",      700, "NotoSansKannada-Bold.ttf"),
]


def fetch_url(family: str, weight: int) -> str | None:
    """Hit Google's css2 API with a legacy UA so we get TTF (not woff2)."""
    q = family.replace(" ", "+")
    url = f"https://fonts.googleapis.com/css2?family={q}:wght@{weight}&display=swap"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            css = r.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"  css2 fetch failed: {e}", file=sys.stderr)
        return None
    # Extract last TTF URL (last block usually has the widest unicode range)
    matches = re.findall(r"url\((https?://[^)]+\.ttf)\)", css) or \
              re.findall(r"url\((https?://[^)]+)\)", css)  # legacy kit URLs
    if not matches:
        return None
    # Take the LAST url — typically the latin/all range. For our purposes any
    # TTF URL works; weights are explicit in the request.
    return matches[-1]


def download(url: str, out: Path) -> bool:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
    except Exception as e:
        print(f"  download failed: {e}", file=sys.stderr)
        return False
    if len(data) < 1024:
        print(f"  download too small ({len(data)} bytes)", file=sys.stderr)
        return False
    out.write_bytes(data)
    return True


def main() -> int:
    # Clear stale fonts
    for f in OUT.glob("*.ttf"):
        f.unlink()

    failures = 0
    for family, weight, outname in FONTS:
        out = OUT / outname
        print(f"→ {outname}  ({family} w={weight})")
        for attempt in range(3):
            url = fetch_url(family, weight)
            if not url:
                time.sleep(1)
                continue
            if download(url, out):
                size_kb = out.stat().st_size // 1024
                print(f"  OK ({size_kb} KB)")
                break
            time.sleep(1.5)
        else:
            print(f"  FAILED after 3 attempts")
            failures += 1

    print()
    print("=== Downloaded fonts ===")
    for f in sorted(OUT.glob("*.ttf")):
        size_kb = f.stat().st_size // 1024
        print(f"  {f.name:42s}  {size_kb:>5d} KB")

    if failures:
        print(f"\n{failures} font(s) failed to download.", file=sys.stderr)
        return 1
    print(f"\nAll {len(FONTS)} fonts downloaded to {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
