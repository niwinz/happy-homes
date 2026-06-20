#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

pandoc brand.md -s -o brand.pdf \
  --pdf-engine=xelatex \
  -V mainfont='Inter' \
  -V fontsize=11pt \
  -V geometry='tmargin=1.5cm,bmargin=1.5cm,lmargin=1.5cm,rmargin=1.5cm' \
  -V papersize=a5 \
  -V header-includes='\usepackage{xcolor}
\usepackage{hyperref}
\usepackage{fontspec}
\newfontfamily\brandserif{Cardo}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0.7em}
\usepackage[compact]{titlesec}
\titleformat{\section}{\LARGE\brandserif\bfseries\color[HTML]{1A3A4A}}{}{0em}{}[\vspace{-0.4em}{\color[HTML]{C76B4C}\rule{\textwidth}{0.8pt}}]
\titleformat{\subsection}{\large\brandserif\bfseries\color[HTML]{1A3A4A}}{}{0em}{}
\titleformat{\subsubsection}{\normalsize\bfseries\color[HTML]{C76B4C}}{}{0em}{}
\renewenvironment{quote}{\list{}{\leftmargin=0.4cm\rightmargin=0.4cm}\brandserif\small\itshape\color[HTML]{1A3A4A}\item\relax}{\endlist}
\hypersetup{colorlinks=true, linkcolor=[HTML]{1A3A4A}, urlcolor=[HTML]{C76B4C}, pdftitle={HappyHomes — Imagen de Marca}}'

rm -f brand.aux brand.log brand.out brand.tex

echo "brand.pdf generated"
