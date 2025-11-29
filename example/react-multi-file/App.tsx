/**
 * React components that use translations
 * No setup() call needed here - it's already configured in index.tsx
 */

import React from "react";
import { useTranslation } from "hgts/react";

// Header component
function Header() {
    const { t } = useTranslation();

    return (
        <header>
            <h1>{t("app.title")}</h1>
            <p>{t("app.description")}</p>
        </header>
    );
}

// Navigation component
function Navigation() {
    const { t } = useTranslation();

    return (
        <nav>
            <a href="#home">{t("nav.home")}</a>
            <a href="#about">{t("nav.about")}</a>
            <a href="#contact">{t("nav.contact")}</a>
        </nav>
    );
}

// Message counter component
function MessageCounter({ count }: { count: number }) {
    const { t } = useTranslation();

    return <div>{t("messages", { count })}</div>;
}

// Language switcher component
function LanguageSwitcher() {
    const { changeLanguage, language, availableLanguages } = useTranslation();

    return (
        <div>
            <label>Language: </label>
            <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
            >
                {availableLanguages().map((lang) => (
                    <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
    );
}

// Main App component
export default function App() {
    return (
        <div>
            <Header />
            <LanguageSwitcher />
            <Navigation />
            <main>
                <MessageCounter count={0} />
                <MessageCounter count={1} />
                <MessageCounter count={10} />
            </main>
        </div>
    );
}
