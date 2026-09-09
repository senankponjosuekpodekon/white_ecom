import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).parent
OUT = ROOT / "REACT_SPECIFICATION.md"


def read_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        return {"__error__": str(e)}


def list_files(folder: str, pattern: str = "*"):
    d = ROOT / folder
    if not d.exists():
        return []
    return sorted([p for p in d.rglob(pattern) if p.is_file()])


def summarize_setting(s):
    """Return a one-line description for a setting schema item."""
    if not isinstance(s, dict):
        return str(s)
    t = s.get("type", "")
    if t == "header":
        return f"### {s.get('content', '')}"
    line = f"- **{s.get('id', s.get('type', ''))}** (`{t}`)"
    if "label" in s:
        line += f" — {s['label']}"
    if "info" in s:
        line += f" ({s['info']})"
    if "default" in s:
        d = s["default"]
        if isinstance(d, (dict, list)):
            d = json.dumps(d)
        line += f" `[default: {d}]`"
    return line


def render_block(block):
    lines = []
    lines.append(f"  - **{block.get('type', 'block')}**")
    if "name" in block:
        lines[-1] += f" — {block['name']}"
    for s in block.get("settings", []):
        lines.append("    " + summarize_setting(s))
    return "\n".join(lines)


def render_section(path: Path, data: dict):
    lines = []
    name = data.get("name", path.stem)
    lines.append(f"### {name}")
    lines.append(f"- Fichier : `{path.relative_to(ROOT)}`")
    if "tag" in data:
        lines.append(f"- Tag : `{data['tag']}`")
    if "class" in data:
        lines.append(f"- Classe : `{data['class']}`")
    if "max_blocks" in data:
        lines.append(f"- Max blocks : `{data['max_blocks']}`")

    if "settings" in data and data["settings"]:
        lines.append("#### Settings")
        for s in data["settings"]:
            text = summarize_setting(s)
            if text.startswith("###"):
                lines.append(f"\n{text}\n")
            else:
                lines.append(text)

    if "blocks" in data and data["blocks"]:
        lines.append("\n#### Blocks")
        for block in data["blocks"]:
            lines.append(render_block(block))

    if "presets" in data and data["presets"]:
        lines.append("\n#### Presets")
        for p in data["presets"]:
            lines.append(f"- {p.get('name', 'Unnamed')} : blocks={list(p.get('blocks', {}).keys())}")

    return "\n".join(lines)


def render_template(path: Path, data: dict):
    lines = []
    lines.append(f"### {path.stem}")
    if "layout" in data:
        lines.append(f"- Layout : `{data['layout']}`")
    if "sections" in data:
        sections = data["sections"]
        order = data.get("order", sorted(sections.keys()))
        lines.append("- Sections (ordre) :")
        for sid in order:
            sec = sections.get(sid, {})
            type_ = sec.get("type", "?")
            settings = list(sec.get("settings", {}).keys())
            lines.append(f"  1. `{type_}` (id={sid}, settings={settings})")
    return "\n".join(lines)


def get_feature_set(sections, settings_schema, assets):
    """Detect high-level features to fuel proposals."""
    features = set()
    section_types = {Path(p).stem for p in sections}

    keywords = {
        "mega-menu": "Mega menu",
        "cart-drawer": "Panier latéral (cart drawer)",
        "quick-view": "Quick view produit",
        "compare-product": "Comparaison de produits",
        "wishlist": "Liste de souhaits / favoris",
        "countdown-timer": "Compte à rebours / flash sale",
        "lookbook": "Lookbook",
        "hotspots-image": "Image avec points interactifs",
        "age-verifier": "Vérification d'âge",
        "cookie-banner": "Bannière cookies",
        "announcement-bar": "Barre d'annonces",
        "banner-with-slider": "Bannière slider",
        "collection-tabs": "Onglets de collections",
        "product-bundles": "Bundles de produits",
        "volume-pricing": "Prix par volume",
        "gift-wrapping": "Emballage cadeau",
        "store-locator": "Find a store / localisateur",
        "recently-viewed": "Récemment consultés",
        "sticky-add-to-cart": "Sticky add to cart",
        "ask-question": "Formulaire poser une question",
        "image-comparison": "Comparateur d'images",
        "before-after": "Avant/Après",
    }

    for k, label in keywords.items():
        if any(k in s for s in section_types):
            features.add(label)
        for a in assets:
            if k in a.name:
                features.add(label)

    if any("rtl" in str(s).lower() for s in settings_schema):
        features.add("Support RTL")

    return sorted(features)


def main():
    sections = list_files("sections", "*.json")
    templates = list_files("templates", "*.json")
    snippets = list_files("snippets", "*.liquid")
    assets = list_files("assets")
    locales = list_files("locales", "*.json")
    layouts = list_files("layout", "*.liquid")

    settings_schema = read_json(ROOT / "config" / "settings_schema.json")
    settings_data = read_json(ROOT / "config" / "settings_data.json")

    md = []
    md.append("# React + Textual Specification — Minimog Shopify Theme")
    md.append("")
    md.append("## Theme identity")
    theme_info = settings_schema[0] if settings_schema and isinstance(settings_schema[0], dict) else {}
    for k, v in theme_info.items():
        md.append(f"- **{k}** : `{v}`")
    md.append("")

    md.append("## Global settings (settings_schema)")
    for group in settings_schema[1:] if settings_schema else []:
        md.append(f"### {group.get('name', 'Group')}")
        for s in group.get("settings", []):
            text = summarize_setting(s)
            if text.startswith("###"):
                md.append(f"\n{text}\n")
            else:
                md.append(text)
        md.append("")

    md.append("## Sections")
    md.append(f"Total sections : {len(sections)}\n")
    for p in sections:
        data = read_json(p)
        md.append(render_section(p, data))
        md.append("")

    md.append("## Templates")
    md.append(f"Total templates : {len(templates)}\n")
    for p in templates:
        data = read_json(p)
        md.append(render_template(p, data))
        md.append("")

    md.append("## Snippets")
    md.append(f"Total snippets : {len(snippets)}")
    for p in snippets:
        md.append(f"- `{p.relative_to(ROOT)}`")
    md.append("")

    md.append("## Assets")
    by_ext = {}
    for p in assets:
        ext = p.suffix or "(no ext)"
        by_ext.setdefault(ext, []).append(p)
    for ext in sorted(by_ext):
        md.append(f"### {ext[1:] if ext.startswith('.') else ext} ({len(by_ext[ext])})")
        for p in by_ext[ext][:20]:
            md.append(f"- `{p.relative_to(ROOT)}`")
        if len(by_ext[ext]) > 20:
            md.append(f"- ... and {len(by_ext[ext]) - 20} more")
        md.append("")

    md.append("## Locales")
    md.append(f"Total locale files : {len(locales)}")
    for p in locales:
        md.append(f"- `{p.relative_to(ROOT)}`")
    md.append("")

    md.append("## Layout files")
    md.append(f"Total layout files : {len(layouts)}")
    for p in layouts:
        md.append(f"- `{p.relative_to(ROOT)}`")
    md.append("")

    md.append("## Detected features")
    features = get_feature_set(sections, settings_schema, assets)
    for f in features:
        md.append(f"- {f}")
    md.append("")

    md.append("## React mapping proposal")
    md.append("")
    md.append("### Global components")
    md.append("- `ThemeProvider` — injecte les `settings_data`, les locales, le panier et le currency.")
    md.append("- `Layout` — wrapper `<html lang=...>`, `<head>` SEO, favicon, CSS/JS globaux.")
    md.append("- `CartProvider` — état panier, drawer, quick view, add-to-cart AJAX.")
    md.append("- `SearchProvider` — search predictive, filters.")
    md.append("")
    md.append("### Page templates (Next.js App Router)")
    for p in templates:
        data = read_json(p)
        route = p.stem
        md.append(f"- `app/[locale]/{route}/page.tsx`")
        if "sections" in data:
            for sid in data.get("order", []):
                sec = data["sections"].get(sid, {})
                md.append(f"  - `<{sec.get('type', sid).replace('-', ' ').title().replace(' ', '')} />`")
        md.append("")
    md.append("")

    md.append("### Section → React component mapping (all)")
    md.append("")
    for p in sections:
        data = read_json(p)
        comp = p.stem.replace('-', ' ').title().replace(' ', '')
        md.append(f"- `{p.stem}` → `<{comp} />` (props: settings + blocks)")
    md.append("")

    md.append("## Proposals / Observations")
    md.append("")
    md.append("1. **Data model** : le thème repose sur `settings_schema` + `settings_data` + sections JSON. En React/Next, il faut remplacer ce trio par un store de config côté backend (`store-config`) et des blocs normalisés.")
    md.append("2. **CSS** : ~100 fichiers CSS atomiques (`assets/*.css`) + `main.css`. Il faut les migrer en Tailwind/CSS variables ou au moins les bundler avec Vite/Webpack.")
    md.append("3. **JS** : de nombreux scripts vanilla (`assets/*.js`) manipulent le DOM. À migrer en hooks React (ex. `useCart`, `useSearch`, `useLocalization`).")
    md.append("4. **Liquid** : les snippets/templates utilisent `{% render %}`. L'équivalent React = composants réutilisables avec props typées.")
    md.append("5. **Images** : `assets/` contient aussi des SVG/PNGs (flèches, logos, filtres couleur). À externaliser dans `public/` ou `app/icons/`.")
    md.append("6. **Locales** : translations clés par fichier de langue. À fusionner dans `messages/fr.json`, `messages/en.json`, etc.")
    md.append("7. **Sections Shopify** : la plupart sont déjà des blocs autonomes, donc la correspondance React 1:1 est directe. Le gros travail est le parsing des `settings` en props React + validation Zod.")
    md.append("8. **Features avancées** : mega-menu, quick-view, compare, wishlist, flash-sale nécessitent un state manager (React Context / Zustand) + API Medusa.")
    md.append("9. **Priorité** : commencer par `theme.liquid` (layout), puis `index.json`, `product.json`, `collection.json` ; enfin le cart drawer.")

    OUT.write_text("\n".join(md), encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
