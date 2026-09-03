export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override?: Record<string, unknown>
): T {
  if (!override) return base;
  const result = { ...base } as Record<string, unknown>;

  for (const key of Object.keys(override)) {
    const value = override[key];
    if (value === undefined) continue;

    if (isObject(value) && isObject(result[key])) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
