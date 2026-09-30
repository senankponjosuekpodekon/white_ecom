const allowedTags = new Set([
  "b",
  "i",
  "em",
  "strong",
  "u",
  "br",
  "p",
  "span",
  "a",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
])

function isAllowedHref(url: string): boolean {
  try {
    const normalized = url.trim().toLowerCase()
    if (
      normalized.startsWith("http://") ||
      normalized.startsWith("https://") ||
      normalized.startsWith("/") ||
      normalized.startsWith("#") ||
      normalized.startsWith("mailto:") ||
      normalized.startsWith("tel:")
    ) {
      return !/javascript:/i.test(normalized)
    }
    return false
  } catch {
    return false
  }
}

function cleanAttributes(tag: string, attributes: string): string {
  if (tag === "a") {
    const hrefMatch =
      attributes.match(/href\s*=\s*"([^"]*)"/i) ??
      attributes.match(/href\s*=\s*'([^']*)'/i) ??
      attributes.match(/href\s*=\s*([^\s>]*)/i)
    if (hrefMatch && !isAllowedHref(hrefMatch[1])) {
      return ' href="#"'
    }
    return attributes.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|[^\s>]*)/gi, "")
  }
  return attributes.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|[^\s>]*)/gi, "")
}

export function sanitizeHtml(input: string): string {
  if (!input) return ""
  let s = input.replace(/<script[\s\S]*?>\s*<\/script>/gi, "")
  s = s.replace(/<style[\s\S]*?>\s*<\/style>/gi, "")
  s = s.replace(/<script\s*\/>/gi, "")
  s = s.replace(/javascript:/gi, "")
  s = s.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|[^\s>]*)/gi, "")

  return s.replace(/<\/?([a-zA-Z0-9]+)([^>]*)?>/g, (match, tagName, attrs = "") => {
    const name = (tagName as string).toLowerCase()
    if (!allowedTags.has(name)) {
      return ""
    }
    const cleaned = cleanAttributes(name, attrs as string)
    return `<${match.startsWith("</") ? "/" : ""}${name}${cleaned}>`
  })
}
