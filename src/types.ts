export type Translations = {
  [key: string]: string | Translations;
};

export type LanguageResources = {
  [locale: string]: Translations;
};

export type InterpolationParams = {
  [key: string]: string | number;
};

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
}
