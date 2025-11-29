import { useState, useCallback } from "react";
import { hgts } from "./index";
import { InterpolationParams } from "./types";

/**
 * React hook for using HGTS translations
 * @returns Object containing translation function and language utilities
 * @example
 * function MyComponent() {
 *   const { t, changeLanguage, language } = useTranslation();
 *
 *   return (
 *     <div>
 *       <p>{t('greeting')}</p>
 *       <button onClick={() => changeLanguage('es')}>Español</button>
 *     </div>
 *   );
 * }
 */
export function useTranslation() {
    const [language, setLanguage] = useState(hgts.getLanguage());

    /**
     * Translate a key with optional interpolation
     */
    const t = useCallback(
        (key: string, params?: InterpolationParams): string => {
            return hgts.t(key, params);
        },
        [language]
    );

    /**
     * Change the current language and trigger re-render
     */
    const changeLanguage = useCallback((locale: string): void => {
        hgts.changeLanguage(locale);
        setLanguage(locale);
    }, []);

    /**
     * Get available languages
     */
    const availableLanguages = useCallback((): string[] => {
        return hgts.getAvailableLanguages();
    }, []);

    return {
        t,
        changeLanguage,
        language,
        availableLanguages,
    };
}
