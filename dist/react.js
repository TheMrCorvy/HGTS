"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslation = useTranslation;
const react_1 = require("react");
const index_1 = require("./index");
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
function useTranslation() {
    const [language, setLanguage] = (0, react_1.useState)(index_1.hgts.getLanguage());
    /**
     * Translate a key with optional interpolation
     */
    const t = (0, react_1.useCallback)((key, params) => {
        return index_1.hgts.t(key, params);
    }, [language]);
    /**
     * Change the current language and trigger re-render
     */
    const changeLanguage = (0, react_1.useCallback)((locale) => {
        index_1.hgts.changeLanguage(locale);
        setLanguage(locale);
    }, []);
    /**
     * Get available languages
     */
    const availableLanguages = (0, react_1.useCallback)(() => {
        return index_1.hgts.getAvailableLanguages();
    }, []);
    return {
        t,
        changeLanguage,
        language,
        availableLanguages,
    };
}
