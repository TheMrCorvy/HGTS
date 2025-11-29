import {
  HGTSOptions,
  Translations,
  LanguageResources,
  InterpolationParams,
} from "./types";

class HGTS {
  private static instance: HGTS;
  private resources: LanguageResources = {};
  private currentLocale: string = "en";
  private defaultLocale: string = "en";
  private fallbackLocale: string = "en";

  private constructor() {}

  public static getInstance(): HGTS {
    if (!HGTS.instance) {
      HGTS.instance = new HGTS();
    }
    return HGTS.instance;
  }

  /**
   * Initialize HGTS with translation resources
   * @param options - Configuration options
   * @example
   * hgts.setup({
   *   resources: {
   *     en: { greeting: "Hello, {{name}}!" },
   *     es: { greeting: "¡Hola, {{name}}!" }
   *   },
   *   defaultLocale: 'en',
   *   fallbackLocale: 'en'
   * });
   */
  public setup(options: HGTSOptions): void {
    this.resources = options.resources;
    this.defaultLocale = options.defaultLocale || "en";
    this.fallbackLocale = options.fallbackLocale || this.defaultLocale;
    this.currentLocale = this.defaultLocale;
  }

  /**
   * Change the current language
   * @param locale - The locale code to switch to
   * @throws Error if locale is not found in resources
   * @example
   * hgts.changeLanguage('es');
   */
  public changeLanguage(locale: string): void {
    if (!this.resources[locale]) {
      throw new Error(
        `Language "${locale}" not found. Available languages: ${Object.keys(
          this.resources
        ).join(", ")}`
      );
    }
    this.currentLocale = locale;
  }

  /**
   * Get the current language
   * @returns The current locale code
   */
  public getLanguage(): string {
    return this.currentLocale;
  }

  /**
   * Get available languages
   * @returns Array of available locale codes
   */
  public getAvailableLanguages(): string[] {
    return Object.keys(this.resources);
  }

  /**
   * Translate a key with optional variable interpolation
   * @param key - The translation key (supports dot notation for nested keys)
   * @param params - Optional parameters for variable interpolation
   * @returns The translated string or the key if not found
   * @example
   * hgts.t('greeting'); // "Hello, World!"
   * hgts.t('welcome', { name: 'John' }); // "Welcome, John!"
   * hgts.t('nested.message'); // "This is nested"
   */
  public t(key: string, params?: InterpolationParams): string {
    // Try current locale first
    let translation = this.getTranslation(key, this.currentLocale);

    // Fallback to fallback locale if not found
    if (translation === null && this.currentLocale !== this.fallbackLocale) {
      translation = this.getTranslation(key, this.fallbackLocale);
    }

    // If still not found, return the key
    if (translation === null) {
      return key;
    }

    // Apply interpolation if params provided
    if (params) {
      return this.interpolate(translation, params);
    }

    return translation;
  }

  /**
   * Get a translation from a specific locale
   * @param key - The translation key
   * @param locale - The locale to get the translation from
   * @returns The translation string or null if not found
   */
  private getTranslation(key: string, locale: string): string | null {
    const translations = this.resources[locale];
    if (!translations) {
      return null;
    }

    const keys = key.split(".");
    let current: string | Translations = translations;

    for (const k of keys) {
      if (typeof current === "object" && current !== null && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }

    return typeof current === "string" ? current : null;
  }

  /**
   * Replace variables in a translation string
   * @param str - The string containing {{variable}} placeholders
   * @param params - The parameters to interpolate
   * @returns The interpolated string
   */
  private interpolate(str: string, params: InterpolationParams): string {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return key in params ? String(params[key]) : match;
    });
  }
}

export const hgts = HGTS.getInstance();
