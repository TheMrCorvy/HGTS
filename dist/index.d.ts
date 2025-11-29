import { HGTSOptions, InterpolationParams } from "./types";
declare class HGTS {
    private static instance;
    private resources;
    private currentLocale;
    private defaultLocale;
    private fallbackLocale;
    private constructor();
    static getInstance(): HGTS;
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
    setup(options: HGTSOptions): void;
    /**
     * Change the current language
     * @param locale - The locale code to switch to
     * @throws Error if locale is not found in resources
     * @example
     * hgts.changeLanguage('es');
     */
    changeLanguage(locale: string): void;
    /**
     * Get the current language
     * @returns The current locale code
     */
    getLanguage(): string;
    /**
     * Get available languages
     * @returns Array of available locale codes
     */
    getAvailableLanguages(): string[];
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
    t(key: string, params?: InterpolationParams): string;
    /**
     * Get a translation from a specific locale
     * @param key - The translation key
     * @param locale - The locale to get the translation from
     * @returns The translation string or null if not found
     */
    private getTranslation;
    /**
     * Replace variables in a translation string
     * @param str - The string containing {{variable}} placeholders
     * @param params - The parameters to interpolate
     * @returns The interpolated string
     */
    private interpolate;
}
export declare const hgts: HGTS;
export {};
