#!/usr/bin/env python3
"""Build the branded Pandoc reference DOCX using only the Python stdlib."""

from __future__ import annotations

import io
import re
import subprocess
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
CT_NS = "http://schemas.openxmlformats.org/package/2006/content-types"

ET.register_namespace("w", W_NS)
ET.register_namespace("a", A_NS)
ET.register_namespace("r", R_NS)
ET.register_namespace("", REL_NS)


def qname(namespace: str, name: str) -> str:
    return f"{{{namespace}}}{name}"


def child(parent: ET.Element, name: str) -> ET.Element:
    element = parent.find(qname(W_NS, name))
    if element is None:
        element = ET.SubElement(parent, qname(W_NS, name))
    return element


def set_property(parent: ET.Element, name: str, attributes: dict[str, str]) -> None:
    element = child(parent, name)
    for key, value in attributes.items():
        element.set(qname(W_NS, key), value)


def style_element(root: ET.Element, style_id: str) -> ET.Element:
    for style in root.findall(qname(W_NS, "style")):
        if style.get(qname(W_NS, "styleId")) == style_id:
            return style
    raise RuntimeError(f"Pandoc reference DOCX does not contain style {style_id}")


def apply_style(
    root: ET.Element,
    style_id: str,
    *,
    font: str,
    size: int,
    color: str,
    bold: bool = False,
    italic: bool = False,
    before: int | None = None,
    after: int | None = None,
    line: int | None = None,
    keep_next: bool = False,
    border_bottom: str | None = None,
    shading: str | None = None,
) -> None:
    style = style_element(root, style_id)
    rpr = child(style, "rPr")
    set_property(rpr, "rFonts", {
        "ascii": font,
        "hAnsi": font,
        "eastAsia": font,
        "cs": font,
    })
    set_property(rpr, "sz", {"val": str(size)})
    set_property(rpr, "szCs", {"val": str(size)})
    set_property(rpr, "color", {"val": color})
    if bold:
        child(rpr, "b")
        child(rpr, "bCs")
    if italic:
        child(rpr, "i")
        child(rpr, "iCs")

    ppr = child(style, "pPr")
    if any(value is not None for value in (before, after, line)):
        spacing = child(ppr, "spacing")
        if before is not None:
            spacing.set(qname(W_NS, "before"), str(before))
        if after is not None:
            spacing.set(qname(W_NS, "after"), str(after))
        if line is not None:
            spacing.set(qname(W_NS, "line"), str(line))
            spacing.set(qname(W_NS, "lineRule"), "auto")
    if keep_next:
        child(ppr, "keepNext")
    if border_bottom:
        borders = child(ppr, "pBdr")
        bottom = child(borders, "bottom")
        bottom.set(qname(W_NS, "val"), "single")
        bottom.set(qname(W_NS, "sz"), "8")
        bottom.set(qname(W_NS, "space"), "4")
        bottom.set(qname(W_NS, "color"), border_bottom)
    if shading:
        set_property(ppr, "shd", {"val": "clear", "color": "auto", "fill": shading})


def add_header_footer(entries: dict[str, bytes], document: ET.Element) -> None:
    relationships = ET.fromstring(entries["word/_rels/document.xml.rels"])
    used_ids = {
        relation.get("Id", "")
        for relation in relationships.findall(qname(REL_NS, "Relationship"))
    }
    number = 1
    while f"rId{number}" in used_ids:
        number += 1
    header_id = f"rId{number}"
    footer_id = f"rId{number + 1}"

    for relation_id, relation_type, target in [
        (header_id, "header", "header1.xml"),
        (footer_id, "footer", "footer1.xml"),
    ]:
        relation = ET.SubElement(relationships, qname(REL_NS, "Relationship"))
        relation.set("Id", relation_id)
        relation.set(
            "Type",
            f"http://schemas.openxmlformats.org/officeDocument/2006/relationships/{relation_type}",
        )
        relation.set("Target", target)
    entries["word/_rels/document.xml.rels"] = ET.tostring(
        relationships, encoding="utf-8", xml_declaration=True
    )

    content_types = ET.fromstring(entries["[Content_Types].xml"])
    for part_name, content_type in [
        ("/word/header1.xml", "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"),
        ("/word/footer1.xml", "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"),
    ]:
        override = ET.SubElement(content_types, qname(CT_NS, "Override"))
        override.set("PartName", part_name)
        override.set("ContentType", content_type)
    ET.register_namespace("", CT_NS)
    entries["[Content_Types].xml"] = ET.tostring(
        content_types, encoding="utf-8", xml_declaration=True
    )

    sect_pr = document.find(f".//{qname(W_NS, 'sectPr')}")
    if sect_pr is None:
        raise RuntimeError("Pandoc reference DOCX has no section properties")
    header_reference = ET.Element(qname(W_NS, "headerReference"))
    header_reference.set(qname(W_NS, "type"), "default")
    header_reference.set(qname(R_NS, "id"), header_id)
    footer_reference = ET.Element(qname(W_NS, "footerReference"))
    footer_reference.set(qname(W_NS, "type"), "default")
    footer_reference.set(qname(R_NS, "id"), footer_id)
    sect_pr.insert(0, footer_reference)
    sect_pr.insert(0, header_reference)

    entries["word/header1.xml"] = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="{W_NS}" xmlns:r="{R_NS}">
  <w:p>
    <w:pPr><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="C76B4C"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="EB Garamond" w:hAnsi="EB Garamond"/><w:b/><w:color w:val="1A3A4A"/><w:sz w:val="20"/></w:rPr><w:t>HappyHomes</w:t></w:r>
  </w:p>
</w:hdr>'''.encode("utf-8")
    entries["word/footer1.xml"] = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="{W_NS}" xmlns:r="{R_NS}">
  <w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Inter" w:hAnsi="Inter"/><w:color w:val="4F5B62"/><w:sz w:val="16"/></w:rPr><w:t>HappyHomes · Acuerdo de servicio · Página </w:t></w:r>
    <w:fldSimple w:instr="PAGE"><w:r><w:rPr><w:rFonts w:ascii="Inter" w:hAnsi="Inter"/><w:color w:val="4F5B62"/><w:sz w:val="16"/></w:rPr><w:t>1</w:t></w:r></w:fldSimple>
  </w:p>
</w:ftr>'''.encode("utf-8")


def build(output_path: Path) -> None:
    completed = subprocess.run(
        ["pandoc", "--print-default-data-file", "reference.docx"],
        check=True,
        capture_output=True,
    )
    with zipfile.ZipFile(io.BytesIO(completed.stdout)) as archive:
        entries = {name: archive.read(name) for name in archive.namelist()}

    entries["docProps/core.xml"] = re.sub(
        rb">\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z<",
        b">2000-01-01T00:00:00Z<",
        entries["docProps/core.xml"],
    )

    theme = ET.fromstring(entries["word/theme/theme1.xml"])
    major = theme.find(f".//{qname(A_NS, 'majorFont')}/{qname(A_NS, 'latin')}")
    minor = theme.find(f".//{qname(A_NS, 'minorFont')}/{qname(A_NS, 'latin')}")
    if major is not None:
        major.set("typeface", "EB Garamond")
    if minor is not None:
        minor.set("typeface", "Inter")
    entries["word/theme/theme1.xml"] = ET.tostring(
        theme, encoding="utf-8", xml_declaration=True
    )

    styles = ET.fromstring(entries["word/styles.xml"])
    apply_style(styles, "Normal", font="Inter", size=20, color="1A3A4A", after=100, line=276)
    apply_style(styles, "BodyText", font="Inter", size=20, color="1A3A4A", after=100, line=276)
    apply_style(styles, "Compact", font="Inter", size=18, color="1A3A4A", after=40, line=240)
    apply_style(styles, "Title", font="EB Garamond", size=38, color="1A3A4A", bold=True, after=160)
    apply_style(
        styles,
        "Heading1",
        font="EB Garamond",
        size=30,
        color="1A3A4A",
        bold=True,
        before=280,
        after=120,
        keep_next=True,
        border_bottom="C76B4C",
    )
    apply_style(styles, "Heading2", font="EB Garamond", size=25, color="1A3A4A", bold=True, before=220, after=80, keep_next=True)
    apply_style(styles, "Heading3", font="Inter", size=20, color="A04A2E", bold=True, before=180, after=60, keep_next=True)
    apply_style(styles, "BlockText", font="Inter", size=18, color="1A3A4A", bold=True, after=100, line=240, shading="F2ECE4")
    apply_style(styles, "Table", font="Inter", size=17, color="1A3A4A", after=40, line=220)
    apply_style(styles, "Caption", font="Inter", size=16, color="4F5B62", italic=True, after=60)
    apply_style(styles, "Hyperlink", font="Inter", size=20, color="A04A2E")
    entries["word/styles.xml"] = ET.tostring(styles, encoding="utf-8", xml_declaration=True)

    document = ET.fromstring(entries["word/document.xml"])
    sect_pr = document.find(f".//{qname(W_NS, 'sectPr')}")
    if sect_pr is None:
        raise RuntimeError("Pandoc reference DOCX has no section properties")
    set_property(sect_pr, "pgSz", {"w": "11906", "h": "16838"})
    set_property(sect_pr, "pgMar", {
        "top": "1247",
        "right": "1077",
        "bottom": "1134",
        "left": "1077",
        "header": "567",
        "footer": "567",
        "gutter": "0",
    })
    add_header_footer(entries, document)
    entries["word/document.xml"] = ET.tostring(document, encoding="utf-8", xml_declaration=True)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for name, data in entries.items():
            info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o600 << 16
            archive.writestr(info, data)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: build-reference-docx.py OUTPUT.docx")
    build(Path(sys.argv[1]))
