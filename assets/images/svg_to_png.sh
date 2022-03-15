#!/bin/bash
for file in *.svg; do inkscape "$file" --export-filename "${file%svg}png"; inkscape "$file" --export-dpi 192 --export-filename "${file%.svg}@2x.png"; inkscape "$file" --export-dpi 288 --export-filename "${file%.svg}@3x.png"; done

