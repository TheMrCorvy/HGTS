import React from "react";
import { hgts } from "hgts";
import { useTranslation } from "hgts/react";

// Initialize HGTS before using the hook (typically in your main app file)
hgts.setup({
  resources: {
    en: {
      app: {
        title: "My Application",
        subtitle: "Built with HGTS",
      },
      navigation: {
        home: "Home",
        about: "About",
        contact: "Contact",
      },
      welcome: "Welcome, {{name}}!",
      userStats: "You have {{posts}} posts and {{followers}} followers",
      buttons: {
        changeLanguage: "Change Language",
        submit: "Submit",
      },
    },
    es: {
      app: {
        title: "Mi Aplicación",
        subtitle: "Construida con HGTS",
      },
      navigation: {
        home: "Inicio",
        about: "Acerca de",
        contact: "Contacto",
      },
      welcome: "¡Bienvenido, {{name}}!",
      userStats: "Tienes {{posts}} publicaciones y {{followers}} seguidores",
      buttons: {
        changeLanguage: "Cambiar Idioma",
        submit: "Enviar",
      },
    },
    fr: {
      app: {
        title: "Mon Application",
        subtitle: "Construit avec HGTS",
      },
      navigation: {
        home: "Accueil",
        about: "À propos",
        contact: "Contact",
      },
      welcome: "Bienvenue, {{name}}!",
      userStats: "Vous avez {{posts}} publications et {{followers}} abonnés",
      buttons: {
        changeLanguage: "Changer de Langue",
        submit: "Soumettre",
      },
    },
  },
  defaultLocale: "en",
  fallbackLocale: "en",
});

// Language Switcher Component
function LanguageSwitcher() {
  const { t, changeLanguage, language, availableLanguages } = useTranslation();

  return (
    <div style={{ margin: "20px 0" }}>
      <label htmlFor="language-select" style={{ marginRight: "10px" }}>
        {t("buttons.changeLanguage")}:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{ padding: "5px 10px" }}
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

// Navigation Component
function Navigation() {
  const { t } = useTranslation();

  return (
    <nav style={{ display: "flex", gap: "15px", padding: "10px 0" }}>
      <a href="#home">{t("navigation.home")}</a>
      <a href="#about">{t("navigation.about")}</a>
      <a href="#contact">{t("navigation.contact")}</a>
    </nav>
  );
}

// User Profile Component
function UserProfile({
  name,
  posts,
  followers,
}: {
  name: string;
  posts: number;
  followers: number;
}) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        margin: "20px 0",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>{t("welcome", { name })}</h2>
      <p>{t("userStats", { posts, followers })}</p>
    </div>
  );
}

// Main App Component
function App() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <header>
        <h1>{t("app.title")}</h1>
        <p>{t("app.subtitle")}</p>
      </header>

      <LanguageSwitcher />
      <Navigation />

      <main>
        <UserProfile name="John Doe" posts={42} followers={1337} />

        <button style={{ padding: "10px 20px", marginTop: "20px" }}>
          {t("buttons.submit")}
        </button>
      </main>
    </div>
  );
}

export default App;
