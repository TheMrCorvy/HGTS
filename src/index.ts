import {
    HGTSOptions,
    Translations,
    LanguageResources,
    InterpolationParams,
    PluralRuleFunction,
    PluralTranslation,
    PluralForm,
} from "./types";

class HGTS {
    private static instance: HGTS;
    private resources: LanguageResources = {};
    private currentLocale: string = "en";
    private defaultLocale: string = "en";
    private fallbackLocale: string = "en";
    private pluralRule?: PluralRuleFunction;

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
        this.pluralRule = options.pluralRule;
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
     * Translate a key with optional variable interpolation and pluralization
     * @param key - The translation key (supports dot notation for nested keys)
     * @param params - Optional parameters for variable interpolation. Use 'count' for pluralization
     * @returns The translated string or the key if not found
     * @example
     * hgts.t('greeting'); // "Hello, World!"
     * hgts.t('welcome', { name: 'John' }); // "Welcome, John!"
     * hgts.t('items', { count: 0 }); // "No items" (if zero form exists)
     * hgts.t('items', { count: 1 }); // "1 item"
     * hgts.t('items', { count: 5 }); // "5 items"
     */
    public t(key: string, params?: InterpolationParams): string {
        // Check if this is a plural translation (params contains 'count')
        const count = params?.count;
        const isPlural = typeof count === "number";

        // Try current locale first
        let translation = this.getTranslation(
            key,
            this.currentLocale,
            isPlural
        );

        // Fallback to fallback locale if not found
        if (
            translation === null &&
            this.currentLocale !== this.fallbackLocale
        ) {
            translation = this.getTranslation(
                key,
                this.fallbackLocale,
                isPlural
            );
        }

        // If still not found, return the key
        if (translation === null) {
            return key;
        }

        // Handle plural translation
        if (isPlural && typeof translation === "object") {
            translation = this.resolvePlural(
                translation as PluralTranslation,
                count as number
            );
        }

        // If translation is still an object at this point, return the key
        if (typeof translation !== "string") {
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
     * @param allowObject - Whether to return objects (for plural translations)
     * @returns The translation string/object or null if not found
     */
    private getTranslation(
        key: string,
        locale: string,
        allowObject: boolean = false
    ): string | PluralTranslation | null {
        const translations = this.resources[locale];
        if (!translations) {
            return null;
        }

        const keys = key.split(".");
        let current: string | Translations = translations;

        for (const k of keys) {
            if (
                typeof current === "object" &&
                current !== null &&
                k in current
            ) {
                current = current[k];
            } else {
                return null;
            }
        }

        // For plural translations, return the object
        if (
            allowObject &&
            typeof current === "object" &&
            this.isPluralObject(current)
        ) {
            return current as PluralTranslation;
        }

        return typeof current === "string" ? current : null;
    }

    /**
     * Check if an object is a plural translation object
     * @param obj - The object to check
     * @returns True if the object contains plural forms
     */
    private isPluralObject(obj: any): boolean {
        if (typeof obj !== "object" || obj === null) {
            return false;
        }
        const pluralKeys = ["zero", "one", "two", "few", "many", "other"];
        return Object.keys(obj).some((key) => pluralKeys.includes(key));
    }

    /**
     * Resolve which plural form to use based on count
     * @param pluralObj - Object containing different plural forms
     * @param count - The count to determine plural form
     * @returns The appropriate plural string
     */
    private resolvePlural(pluralObj: PluralTranslation, count: number): string {
        // Determine the plural form to use
        let pluralForm: PluralForm;

        if (this.pluralRule) {
            // Use custom plural rule if provided
            pluralForm = this.pluralRule(count, this.currentLocale);
        } else {
            // Use Intl.PluralRules for automatic language-specific pluralization
            try {
                const pluralRules = new Intl.PluralRules(this.currentLocale);
                pluralForm = pluralRules.select(count) as PluralForm;
            } catch (e) {
                // Fallback to simple English-like rules if Intl.PluralRules fails
                pluralForm = this.getDefaultPluralForm(count);
            }
        }

        // Try to get the translation for the determined plural form
        // Fallback order: specific form -> 'other' -> first available form
        return (
            pluralObj[pluralForm] ||
            pluralObj.other ||
            Object.values(pluralObj)[0] ||
            ""
        );
    }

    /**
     * Default plural form resolver (English-like rules)
     * @param count - The count
     * @returns The plural form
     */
    private getDefaultPluralForm(count: number): PluralForm {
        if (count === 0) return "zero";
        if (count === 1) return "one";
        return "other";
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
