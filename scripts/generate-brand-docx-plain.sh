#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

TMP="$(mktemp -d)"
pandoc brand.md -s -o "$TMP/brand.docx"

python3 - "$TMP/brand.docx" <<'PY'
import sys, zipfile, io, re, shutil

src = sys.argv[1]
zin = zipfile.ZipFile(src)
entries = {n: zin.read(n) for n in zin.namelist()}
zin.close()

# Strip all bookmarks from document.xml — leaves plain paragraphs with styles
d = entries['word/document.xml'].decode('utf-8')
d = re.sub(r'<w:bookmarkStart[^>]*/>', '', d)
d = re.sub(r'<w:bookmarkEnd[^>]*/>', '', d)
entries['word/document.xml'] = d.encode('utf-8')

out = src.replace('.docx', '-clean.docx')
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zout:
    for n, data in entries.items():
        zout.writestr(n, data)
shutil.move(out, src)
PY

cp "$TMP/brand.docx" brand.docx
rm -rf "$TMP"

echo "brand.docx generated (plain, no bookmarks)"
