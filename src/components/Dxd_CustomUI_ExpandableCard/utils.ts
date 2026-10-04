/** Reject non-string input and treat whitespace-only configuration as unset. */
export const textValue = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

/** Explicit conversion avoids treating the serialized value 'false' as truthy. */
export const booleanValue = (value: unknown, fallback = false): boolean => {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return fallback;
};

/** Allow CSS hex colors, including alpha, while rejecting arbitrary CSS expressions. */
export const hexColor = (value: unknown, fallback: string): string =>
  typeof value === 'string' &&
  /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value.trim())
    ? value.trim()
    : fallback;
