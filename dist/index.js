"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hgts = void 0;
class HGTS {
    constructor() {
        this.resources = {};
        this.currentLocale = "en";
        this.defaultLocale = "en";
        this.fallbackLocale = "en";
    }
    static getInstance() {
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
    setup(options) {
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
    changeLanguage(locale) {
        if (!this.resources[locale]) {
            throw new Error(`Language "${locale}" not found. Available languages: ${Object.keys(this.resources).join(", ")}`);
        }
        this.currentLocale = locale;
    }
    /**
     * Get the current language
     * @returns The current locale code
     */
    getLanguage() {
        return this.currentLocale;
    }
    /**
     * Get available languages
     * @returns Array of available locale codes
     */
    getAvailableLanguages() {
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
    t(key, params) {
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
    getTranslation(key, locale) {
        const translations = this.resources[locale];
        if (!translations) {
            return null;
        }
        const keys = key.split(".");
        let current = translations;
        for (const k of keys) {
            if (typeof current === "object" && current !== null && k in current) {
                current = current[k];
            }
            else {
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
    interpolate(str, params) {
        return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return key in params ? String(params[key]) : match;
        });
    }
}
exports.hgts = HGTS.getInstance();
