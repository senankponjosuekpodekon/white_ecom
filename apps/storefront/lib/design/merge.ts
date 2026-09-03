import { DesignConfig, DesignFullConfig } from "./types";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeObjects<T extends Record<string, unknown>>(
  base: T,
  override?: DeepPartial<T>
): T {
  if (!override) return base;
  const result = { ...base } as T;
  for (const key of Object.keys(override) as Array<keyof T>) {
    const value = override[key];
    if (value !== undefined) {
      if (
        isObject(value) &&
        isObject(result[key])
      ) {
        (result as Record<string, unknown>)[key as string] = mergeObjects(
          result[key] as Record<string, unknown>,
          value as Record<string, unknown>
        );
      } else {
        (result as Record<string, unknown>)[key as string] = value as unknown;
      }
    }
  }
  return result;
}

export function mergeDesignConfig(
  base: DesignFullConfig,
  override?: DesignConfig
): DesignFullConfig {
  return mergeObjects(base, override);
}
