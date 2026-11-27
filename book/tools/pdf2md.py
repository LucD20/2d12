#!/usr/bin/env python3
"""Turn rulebook PDFs into one Markdown file each, a "## Page N" heading per page.

For reading other games' books during research (book/research/). The output goes to
knowledge-upload/md/ by default, which .gitignore keeps out of the repository:
**never commit a converted book** (the repository is public). What is learned from it
goes into book/research/ as notes with page numbers and short quotes.

    python3 book/tools/pdf2md.py path/to/book.pdf [more.pdf ...] [--out DIR] [--layout]

Uses pdftotext (poppler). Its default reading order follows columns, which suits two-column
rulebooks; --layout keeps the page's physical layout instead (better for tables).
A page with no text (a scan) is marked so: such a book needs OCR, which isn't installed here.
"""
import argparse
import pathlib
import re
import subprocess
import sys


def page_count(pdf):
    info = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True, check=True).stdout
    m = re.search(r"^Pages:\s+(\d+)", info, re.M)
    return int(m.group(1)) if m else 0


def page_text(pdf, n, layout):
    cmd = ["pdftotext", "-f", str(n), "-l", str(n), "-enc", "UTF-8"]
    if layout:
        cmd.append("-layout")
    cmd += [str(pdf), "-"]
    text = subprocess.run(cmd, capture_output=True, text=True).stdout
    text = text.replace("\f", "")
    text = re.sub(r"-\n(?=[a-z])", "", text)  # words hyphenated across lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def convert(pdf, out_dir, layout):
    pages = page_count(pdf)
    out = out_dir / (pdf.stem + ".md")
    empty = 0
    with out.open("w", encoding="utf-8") as f:
        f.write(f"# {pdf.stem}\n\nConverted from `{pdf.name}` ({pages} pages). Not for the repository.\n\n")
        for n in range(1, pages + 1):
            text = page_text(pdf, n, layout)
            if not text:
                empty += 1
                text = "*(no text on this page: an image or a scan)*"
            f.write(f"## Page {n}\n\n{text}\n\n")
    return out, pages, empty


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pdfs", nargs="+", type=pathlib.Path)
    ap.add_argument("--out", type=pathlib.Path,
                    default=pathlib.Path(__file__).resolve().parents[2] / "knowledge-upload" / "md")
    ap.add_argument("--layout", action="store_true", help="keep the physical layout (tables)")
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    for pdf in args.pdfs:
        if not pdf.is_file():
            print(f"missing: {pdf}", file=sys.stderr)
            continue
        out, pages, empty = convert(pdf, args.out, args.layout)
        note = f", {empty} pages with no text (needs OCR)" if empty else ""
        print(f"{pdf.name}: {pages} pages -> {out}{note}")


if __name__ == "__main__":
    main()
