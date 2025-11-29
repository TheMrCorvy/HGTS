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
export declare function useTranslation(): {
    t: (key: string, params?: InterpolationParams) => string;
    changeLanguage: (locale: string) => void;
    language: string;
    availableLanguages: () => string[];
};
