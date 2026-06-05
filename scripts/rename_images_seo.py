#!/usr/bin/env python3
"""
Renombra imágenes en styles/img a kebab-case y actualiza referencias en archivos HTML
Uso: python scripts/rename_images_seo.py
Hará un backup del mapeo en rename_map.json
"""
import re
import os
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / 'styles' / 'img'
TEMPLATES = ROOT / ''
HTML_DIR = ROOT

if not IMG_DIR.exists():
    print('No se encontró:', IMG_DIR)
    raise SystemExit(1)

map_old_new = {}

def kebab(name: str) -> str:
    name = name.strip()
    name = re.sub(r'[^0-9a-zA-Z\.]+', '-', name)
    name = re.sub(r'-+', '-', name)
    name = name.strip('-')
    return name.lower()

# Rename files
for p in IMG_DIR.glob('**/*'):
    if p.is_file():
        new_name = kebab(p.name)
        if new_name != p.name:
            new_path = p.with_name(new_name)
            if new_path.exists():
                print('Destino existe, no renombrado:', new_path)
                continue
            print(f'Renombrando: {p.name} -> {new_name}')
            p.rename(new_path)
            map_old_new[str(p.relative_to(ROOT))] = str(new_path.relative_to(ROOT))

# Update references in templates/*.html
html_files = list((ROOT).glob('*.html')) + list((ROOT).glob('**/*.html'))
updated_files = []
for hf in html_files:
    if not hf.is_file():
        continue
    text = hf.read_text(encoding='utf-8')
    original = text
    for old, new in map_old_new.items():
        # replace both plain filename and path occurrences
        text = text.replace(os.path.basename(old), os.path.basename(new))
        text = text.replace(old.replace('\\', '/'), new.replace('\\', '/'))
    if text != original:
        hf.write_text(text, encoding='utf-8')
        updated_files.append(str(hf.relative_to(ROOT)))

# Save mapping
if map_old_new:
    with open(ROOT / 'rename_map.json', 'w', encoding='utf-8') as f:
        json.dump(map_old_new, f, indent=2, ensure_ascii=False)

print('Renombrado completado. Archivos actualizados:', len(updated_files))
if map_old_new:
    print('Mapa guardado en rename_map.json')
else:
    print('No se realizaron renombrados.')
