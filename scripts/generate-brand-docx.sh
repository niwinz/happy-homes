#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

REF="$(mktemp -d)/brand-reference.docx"

python3 - "$REF" <<'PY'
import sys, zipfile, io, re, subprocess

ref_path = sys.argv[1]

# Default pandoc reference docx as bytes
ref = subprocess.run(['pandoc', '--print-default-data-file', 'reference.docx'],
                     capture_output=True).stdout
zin = zipfile.ZipFile(io.BytesIO(ref))
entries = {n: zin.read(n) for n in zin.namelist()}
zin.close()

# --- theme1.xml: major font = Cardo (headings), minor font = Inter (body) ---
t = entries['word/theme/theme1.xml'].decode('utf-8')
t = re.sub(r'(<a:majorFont>\s*<a:latin typeface=")[^"]*(")',
           r'\1Cardo\2', t, count=1)
t = re.sub(r'(<a:minorFont>\s*<a:latin typeface=")[^"]*(")',
           r'\1Inter\2', t, count=1)
entries['word/theme/theme1.xml'] = t.encode('utf-8')

# --- styles.xml ---
s = entries['word/styles.xml'].decode('utf-8')

# Body base size 12pt -> 11pt (22 half-points)
s = re.sub(r'(<w:rPrDefault>.*?<w:sz w:val=")24("\s*/>\s*<w:szCs w:val=")24(")',
           r'\g<1>22\g<2>22\g<3>', s, flags=re.S)

def edit_style(xml, sid, color=None, bold=False, font_theme=None,
               italic=False, size=None):
    pat = r'(<w:style [^>]*w:styleId="' + sid + r'"[^>]*>)(.*?)(</w:style>)'
    m = re.search(pat, xml, flags=re.S)
    if not m:
        return xml
    body = m.group(2)
    rpr_m = re.search(r'(<w:rPr>)(.*?)(</w:rPr>)', body, flags=re.S)
    def build(inner):
        if color:
            inner = re.sub(r'<w:color [^/]*/>', '', inner)
            inner += '<w:color w:val="' + color + '" />'
        if font_theme:
            inner = re.sub(r'<w:rFonts [^/]*/>', '', inner)
            inner = ('<w:rFonts w:asciiTheme="' + font_theme +
                     '" w:hAnsiTheme="' + font_theme +
                     '" w:eastAsiaTheme="' + font_theme +
                     '" w:cstheme="majorBidi" />' + inner)
        if bold and '<w:b />' not in inner:
            inner = '<w:b /><w:bCs />' + inner
        if italic and '<w:i />' not in inner:
            inner = '<w:i /><w:iCs />' + inner
        if size:
            inner = re.sub(r'<w:sz w:val="\d+" />', '', inner)
            inner = re.sub(r'<w:szCs w:val="\d+" />', '', inner)
            inner += ('<w:sz w:val="' + str(size) +
                      '" /><w:szCs w:val="' + str(size) + '" />')
        return inner
    if rpr_m:
        new_rpr = '<w:rPr>' + build(rpr_m.group(2)) + '</w:rPr>'
        body = body.replace(rpr_m.group(0), new_rpr)
    elif any([color, bold, font_theme, italic, size]):
        rpr = '<w:rPr>'
        if font_theme:
            rpr += ('<w:rFonts w:asciiTheme="' + font_theme +
                    '" w:hAnsiTheme="' + font_theme +
                    '" w:eastAsiaTheme="' + font_theme +
                    '" w:cstheme="majorBidi" />')
        if bold: rpr += '<w:b /><w:bCs />'
        if italic: rpr += '<w:i /><w:iCs />'
        if color: rpr += '<w:color w:val="' + color + '" />'
        if size: rpr += ('<w:sz w:val="' + str(size) +
                         '" /><w:szCs w:val="' + str(size) + '" />')
        rpr += '</w:rPr>'
        body = body + rpr
    return xml[:m.start()] + m.group(1) + body + m.group(3) + xml[m.end():]

s = edit_style(s, 'Title',     color='1A3A4A', bold=True, font_theme='majorHAnsi')
s = edit_style(s, 'Heading1',  color='1A3A4A', bold=True, font_theme='majorHAnsi')
s = edit_style(s, 'Heading2',  color='1A3A4A', bold=True, font_theme='majorHAnsi')
s = edit_style(s, 'Heading3',  color='C76B4C', bold=True, font_theme='majorHAnsi')
s = edit_style(s, 'BlockText', color='1A3A4A', italic=True,
               font_theme='majorHAnsi', size=22)
s = edit_style(s, 'Hyperlink', color='1A3A4A')

entries['word/styles.xml'] = s.encode('utf-8')

with zipfile.ZipFile(ref_path, 'w', zipfile.ZIP_DEFLATED) as zout:
    for n, data in entries.items():
        zout.writestr(n, data)

print('reference built:', ref_path)
PY

pandoc brand.md -s -o brand.docx \
  --reference-doc="$REF" \
  --metadata title='HappyHomes — Imagen de Marca'

echo "brand.docx generated"
