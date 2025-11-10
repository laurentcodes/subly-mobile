/**
 * Utility to format an ISO date string (or any Date parseable string) into a user‑friendly form.
 *
 * Mirrors the behavior previously in app/(tabs)/index.tsx but centralizes it so
 * other "home" related components can reuse consistent formatting.
 *
 * Default pattern: "MMM d, yyyy" via toLocaleDateString with:
 *  - month: short
 *  - day: numeric
 *  - year: numeric
 *
 * Fallback behavior:
 *  - If dateStr is falsy -> returns an em dash (—)
 *  - If parsing fails -> returns the original input string
 *
 * You can override locale + options if needed.
 */

export type FormatDateOptions = {
  /**
   * A BCP 47 language tag or undefined to let the device / JS runtime decide.
   * Example: "en-US", "fr-FR"
   */
  locale?: string;

  /**
   * Intl.DateTimeFormat options to override the defaults.
   * Only supply what you need—will be shallow merged with defaults.
   */
  formatOptions?: Intl.DateTimeFormatOptions;

  /**
   * What to return when the date string is missing / nullish.
   * Default: '—'
   */
  emptyFallback?: string;

  /**
   * What to return when parsing fails.
   * Default: the original input string.
   */
  invalidFallback?: string;
};

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

/**
 * Format a date string safely.
 */
export function formatDate(
  dateStr?: string | null,
  {
    locale,
    formatOptions,
    emptyFallback = '—',
    invalidFallback,
  }: FormatDateOptions = {},
): string {
  if (!dateStr) return emptyFallback;

  // Fast path: attempt to construct date
  const d = new Date(dateStr);

  // Check validity
  if (isNaN(d.getTime())) {
    return invalidFallback !== undefined ? invalidFallback : dateStr;
  }

  try {
    return d.toLocaleDateString(locale, {
      ...DEFAULT_OPTIONS,
      ...(formatOptions || {}),
    });
  } catch {
    // If Intl throws for some weird reason, fall back similarly
    return invalidFallback !== undefined ? invalidFallback : dateStr;
  }
}

/**
 * Convenience alias for the default formatting with only the dateStr param.
 * Equivalent to calling formatDate(dateStr).
 */
export const formatDateDefault = (dateStr?: string | null) =>
  formatDate(dateStr);
