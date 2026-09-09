import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SECTIONS_DIR = ROOT / "sections"
OUT_DIR = ROOT / "react-components"


def to_pascal(name: str) -> str:
    # Prefix identifiers that would start with a digit so they are valid TypeScript names
    if name and name[0].isdigit():
        name = "Section" + name
    parts = re.split(r"[-_\.]", name)
    return "".join(p.capitalize() for p in parts if p)


def ts_type_for(setting: dict) -> str:
    t = setting.get("type", "text")
    type_map = {
        "checkbox": "boolean",
        "number": "number",
        "range": "number",
        "text": "string",
        "textarea": "string",
        "url": "string",
        "html": "string",
        "richtext": "string",
        "image_picker": "string",
        "video_url": "string",
        "select": "string",
        "radio": "string",
        "font_picker": "string",
        "product": "string",
        "product_list": "string[]",
        "collection": "string",
        "collection_list": "string[]",
        "article": "string",
        "blog": "string",
        "page": "string",
        "link_list": "string",
        "menu": "string",
        "color": "string",
        "color_background": "string",
        "color_scheme": "string",
        "color_scheme_group": "string",
        "header": "undefined",
        "paragraph": "undefined",
    }
    if t in type_map:
        return type_map[t]
    if t.endswith("_list"):
        return "string[]"
    return "unknown"


def read_schema(path: Path):
    text = path.read_text(encoding="utf-8")
    match = re.search(r"\{%\s*schema\s*%\}(.*?)\{%\s*endschema\s*%\}", text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(1).strip())
    except Exception as e:
        print(f"Failed to parse schema in {path}: {e}")
        return None


def collect_fields(settings: list):
    fields = []
    for s in settings:
        if s.get("type") in ("header", "paragraph"):
            continue
        sid = s.get("id", "")
        if not sid:
            continue
        optional = "default" in s or s.get("type") == "checkbox"
        q = "?" if optional else ""
        fields.append((sid, ts_type_for(s), optional, s.get("label"), s.get("info")))
    return fields


def generate_section_component(section_type: str, data: dict):
    comp_name = to_pascal(section_type)
    comp_file_name = f"{comp_name}.tsx"

    settings_fields = collect_fields(data.get("settings", []))
    settings_type_lines = [f"export type {comp_name}Settings = {{"]
    for sid, ts_type, optional, label, info in settings_fields:
        comment = ""
        if label:
            text = escape_ts_comment(label)
            if info:
                text += f" — {escape_ts_comment(info)}"
            comment = f"  /** {text} */"
            settings_type_lines.append(comment)
        q = "?" if optional else ""
        settings_type_lines.append(f"  {sid}{q}: {ts_type}")
    settings_type_lines.append("}")

    block_types = []
    if "blocks" in data:
        for b in data["blocks"]:
            bid = b.get("type", "block")
            bfields = collect_fields(b.get("settings", []))
            block_types.append((bid, bfields))

    blocks_type_lines = []
    if block_types:
        blocks_type_lines.append(f"export type {comp_name}Blocks = {{")
        for bid, bfields in block_types:
            blocks_type_lines.append(f"  {bid}?: {{")
            for sid, ts_type, optional, label, info in bfields:
                if label:
                    text = escape_ts_comment(label)
                    if info:
                        text += f" — {escape_ts_comment(info)}"
                    blocks_type_lines.append(f"    /** {text} */")
                q = "?" if optional else ""
                blocks_type_lines.append(f"    {sid}{q}: {ts_type}")
            blocks_type_lines.append("  }")
        blocks_type_lines.append("}")

    props_lines = [
        f"export type {comp_name}Props = BaseSectionProps & {{",
        f"  settings: {comp_name}Settings",
    ]
    if block_types:
        props_lines.append(f"  blocks: {comp_name}Blocks")
    else:
        props_lines.append(f"  blocks?: Record<string, never>")
    props_lines.append("  design?: string")
    props_lines.append("}")
    props_lines.append("")

    component_lines = [
        'import { BaseSectionProps } from "../types"',
        "",
        f"export function {comp_name}({{ id, settings, blocks, design }}: {comp_name}Props) {{",
        f"  return (",
        f"    <section id={{id}} className={{`minimog-section minimog-{section_type}`}}>",
        '      <div className="container">',
        f'        <p className="text-sm text-gray-500">Section: {section_type} (design: {{design ?? "default"}})</p>',
    ]
    if settings_fields:
        component_lines.append('        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>')
    if block_types:
        component_lines.append("        {{blocks && <pre className=\"text-xs\">{{JSON.stringify(blocks, null, 2)}}</pre>}}")
    component_lines.append("      </div>")
    component_lines.append("    </section>")
    component_lines.append("  )")
    component_lines.append("}")

    comp_dir = OUT_DIR / "sections"
    comp_dir.mkdir(parents=True, exist_ok=True)
    comp_file = comp_dir / comp_file_name
    parts = settings_type_lines + [""] + blocks_type_lines + ([""] if blocks_type_lines else []) + props_lines + component_lines
    comp_file.write_text("\n".join(parts), encoding="utf-8")
    return comp_name, section_type


def escape_ts_comment(text: str | None) -> str:
    if not text:
        return ""
    return re.sub(r"\*+\/", "* /", text).replace("\n", " ")


def is_optional_already(sid, fields):
    return False


def generate_index(components: list):
    lines = [
        'import { BaseSectionProps } from "./types"',
        "",
    ]
    for comp_name, _ in components:
        lines.append(f'import {{ {comp_name}, {comp_name}Props }} from "./sections/{comp_name}"')

    lines.append("")
    lines.append("export type MinimogSectionType =")
    for _, section_type in components:
        lines.append(f'  | "{section_type}"')
    lines.append("")
    lines.append("export type MinimogSectionProps =")
    for comp_name, _ in components:
        lines.append(f"  | {comp_name}Props")
    lines.append("")
    lines.append("export const minimogRegistry: Record<MinimogSectionType, (props: any) => JSX.Element> = {")
    for comp_name, section_type in components:
        lines.append(f'  "{section_type}": {comp_name},')
    lines.append("}")
    lines.append("")
    lines.append('export * from "./types"')
    for comp_name, _ in components:
        lines.append(f'export {{ {comp_name} }} from "./sections/{comp_name}"')

    (OUT_DIR / "index.ts").write_text("\n".join(lines), encoding="utf-8")


def generate_types():
    content = """export type BaseSectionProps = {
  id: string
  settings: Record<string, unknown>
  blocks?: Record<string, Record<string, unknown>>
  design?: string
}
"""
    (OUT_DIR / "types.ts").write_text(content, encoding="utf-8")


def main():
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    generate_types()

    section_paths = sorted(SECTIONS_DIR.glob("*.liquid"))
    components = []
    for p in section_paths:
        try:
            data = read_schema(p)
            if data is None:
                continue
            comp_name, section_type = generate_section_component(p.stem, data)
            components.append((comp_name, section_type))
        except Exception as e:
            print(f"Skipped {p}: {e}")

    generate_index(components)
    print(f"Generated {len(components)} section components in {OUT_DIR}")


if __name__ == "__main__":
    main()
