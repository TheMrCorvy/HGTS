export type Translations = {
  [key: string]: string | Translations;
};

export type LanguageResources = {
  [locale: string]: Translations;
};

export type InterpolationParams = {
  [key: string]: string | number;
};

/**
 * Plural forms supported by HGTS
 * - zero: Used when count is 0 (optional, falls back to 'other' if not provided)
 * - one: Used when count is 1
 * - two: Used when count is 2 (optional, used in some languages like Arabic)
 * - few: Used for small numbers (optional, used in some Slavic languages)
 * - many: Used for larger numbers (optional, used in some languages)
 * - other: Default form, used when no other form matches
 */
export type PluralForm = "zero" | "one" | "two" | "few" | "many" | "other";

/**
 * Object containing different plural forms for a translation
 * @example
 * {
 *   zero: "No items",
 *   one: "{{count}} item",
 *   other: "{{count}} items"
 * }
 */
export type PluralTranslation = {
  [key in PluralForm]?: string;
};

/**
 * Function that determines which plural form to use based on count and locale
 * @param count - The number to determine plural form for
 * @param locale - The locale code
 * @returns The plural form to use
 */
export type PluralRuleFunction = (count: number, locale: string) => PluralForm;

export interface HGTSOptions {
  /**
   * The translations object organized by locale
   * @example
   * {
   *   en: { greeting: "Hello" },
   *   es: { greeting: "Hola" }
   * }
   */
  resources: LanguageResources;
  /**
   * The default locale to use
   * @default 'en'
   */
  defaultLocale?: string;
  /**
   * The fallback locale to use when a translation is not found
   * If not provided, defaults to defaultLocale
   */
  fallbackLocale?: string;
  /**
   * Custom plural rule function
   * If not provided, uses built-in Intl.PluralRules
   */
  pluralRule?: PluralRuleFunction;
}
