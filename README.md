# HGTS - Holy Grail Translation System

> The holy grail translation system from Fate series brought to real life by the Chaldea Foundation.

A lightweight, type-safe internationalization (i18n) library for JavaScript and TypeScript applications, with first-class React support.

## ✨ Features

- 🌍 **Multi-language support** - Seamlessly switch between multiple languages
- 🔄 **Automatic fallback** - Falls back to default language when translations are missing
- 📝 **Variable interpolation** - Dynamic values in your translations using `{{variable}}` syntax
- 🔢 **Pluralization** - Smart singular/plural handling with language-specific rules
- 🎯 **Type-safe** - Full TypeScript support with type definitions
- 🪝 **React Hook** - Built-in `useTranslation()` hook for React applications
- 🔑 **Nested keys** - Support for deeply nested translation objects with dot notation
- 🎭 **Singleton pattern** - Global instance accessible throughout your application
- 🪶 **Lightweight** - Zero dependencies (React hook is optional)

## 📦 Installation

```bash
npm install hgts
```

```bash
yarn add hgts
```

```bash
pnpm add hgts
```

## 🚀 Quick Start

### Basic Usage (Node.js / JavaScript)

```javascript
const { hgts } = require("hgts");

// 1. Setup translations
hgts.setup({
  resources: {
    en: {
      greeting: "Hello, {{name}}!",
      farewell: "Goodbye!",
    },
    es: {
      greeting: "¡Hola, {{name}}!",
      farewell: "¡Adiós!",
    },
  },
  defaultLocale: "en",
  fallbackLocale: "en",
});

// 2. Use translations
console.log(hgts.t("greeting", { name: "World" })); // "Hello, World!"

// 3. Change language
hgts.changeLanguage("es");
console.log(hgts.t("greeting", { name: "Mundo" })); // "¡Hola, Mundo!"
```

### TypeScript Usage

```typescript
import { hgts } from "hgts";

hgts.setup({
  resources: {
    en: {
      welcome: "Welcome, {{name}}!",
      nested: {
        message: "This is nested",
      },
    },
    fr: {
      welcome: "Bienvenue, {{name}}!",
      nested: {
        message: "C'est imbriqué",
      },
    },
  },
  defaultLocale: "en",
});

console.log(hgts.t("welcome", { name: "User" })); // "Welcome, User!"
console.log(hgts.t("nested.message")); // "This is nested"
```

### React Usage

```tsx
import { useTranslation } from "hgts/react";

function App() {
  const { t, changeLanguage, language, availableLanguages } = useTranslation();

  return (
    <div>
      <h1>{t("greeting", { name: "User" })}</h1>
      <p>Current language: {language}</p>

      <select onChange={(e) => changeLanguage(e.target.value)} value={language}>
        {availableLanguages().map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Important:** Initialize HGTS before rendering your React app:

```tsx
// index.tsx or main.tsx
import { hgts } from "hgts";
import App from "./App";

hgts.setup({
  resources: {
    en: {
      /* ... */
    },
    es: {
      /* ... */
    },
  },
  defaultLocale: "en",
});

ReactDOM.render(<App />, document.getElementById("root"));
```

## 📖 API Reference

### `hgts.setup(options)`

Initialize HGTS with your translation resources.

**Parameters:**

- `options.resources` (required): Object containing translations organized by locale
- `options.defaultLocale` (optional): Default language code (default: `'en'`)
- `options.fallbackLocale` (optional): Fallback language when translation is missing (default: same as `defaultLocale`)
- `options.pluralRule` (optional): Custom function for plural form resolution

**Example:**

```javascript
hgts.setup({
  resources: {
    en: { greeting: "Hello!" },
    es: { greeting: "¡Hola!" },
    fr: { greeting: "Bonjour!" },
  },
  defaultLocale: "en",
  fallbackLocale: "en",
});
```

### `hgts.t(key, params?)`

Translate a key with optional variable interpolation.

**Parameters:**

- `key`: Translation key (supports dot notation for nested keys)
- `params` (optional): Object with variables for interpolation. Use `count` for pluralization

**Returns:** Translated string or the key if translation not found

**Examples:**

```javascript
hgts.t("greeting"); // "Hello!"
hgts.t("welcome", { name: "John" }); // "Welcome, John!"
hgts.t("nested.deep.value"); // Accesses nested.deep.value
hgts.t("items", { count: 5 }); // "5 items" (plural form)
hgts.t("missing.key"); // "missing.key" (returns key when not found)
```

### `hgts.changeLanguage(locale)`

Switch to a different language.

**Parameters:**

- `locale`: Language code to switch to

**Throws:** Error if locale is not found in resources

**Example:**

```javascript
hgts.changeLanguage("es");
```

### `hgts.getLanguage()`

Get the current active language.

**Returns:** Current locale code (string)

**Example:**

```javascript
const current = hgts.getLanguage(); // "en"
```

### `hgts.getAvailableLanguages()`

Get all available languages.

**Returns:** Array of locale codes

**Example:**

```javascript
const languages = hgts.getAvailableLanguages(); // ['en', 'es', 'fr']
```

### `useTranslation()` (React Hook)

React hook that provides translation functionality with automatic re-rendering on language change.

**Returns:** Object with:

- `t(key, params?)`: Translation function
- `changeLanguage(locale)`: Function to change language
- `language`: Current language code
- `availableLanguages()`: Function returning available languages

**Example:**

```tsx
function MyComponent() {
  const { t, changeLanguage, language } = useTranslation();

  return (
    <div>
      <h1>{t("title")}</h1>
      <button onClick={() => changeLanguage("es")}>Español</button>
      <p>Current: {language}</p>
    </div>
  );
}
```

## 🎨 Advanced Examples

### Nested Translations

```javascript
hgts.setup({
  resources: {
    en: {
      user: {
        profile: {
          title: "User Profile",
          settings: {
            privacy: "Privacy Settings",
          },
        },
      },
    },
  },
  defaultLocale: "en",
});

console.log(hgts.t("user.profile.title")); // "User Profile"
console.log(hgts.t("user.profile.settings.privacy")); // "Privacy Settings"
```

### Variable Interpolation

```javascript
hgts.setup({
  resources: {
    en: {
      cart: "You have {{count}} items totaling ${{total}}",
      greeting: "Hello, {{firstName}} {{lastName}}!",
    },
  },
  defaultLocale: "en",
});

hgts.t("cart", { count: 5, total: 99.99 });
// "You have 5 items totaling $99.99"

hgts.t("greeting", { firstName: "John", lastName: "Doe" });
// "Hello, John Doe!"
```

### Pluralization

HGTS supports smart pluralization with language-specific rules using the native `Intl.PluralRules` API. Simply pass a `count` parameter, and HGTS will automatically select the correct plural form.

**Supported plural forms:**

- `zero` - Used when count is 0 (optional)
- `one` - Used when count is 1
- `two` - Used when count is 2 (optional, for languages like Arabic)
- `few` - Used for small numbers (optional, for Slavic languages)
- `many` - Used for larger numbers (optional)
- `other` - Default form (required)

**Example:**

```javascript
hgts.setup({
  resources: {
    en: {
      items: {
        zero: "No items",
        one: "{{count}} item",
        other: "{{count}} items",
      },
      notifications: {
        zero: "You have no notifications",
        one: "You have {{count}} notification",
        other: "You have {{count}} notifications",
      },
    },
    es: {
      items: {
        zero: "Sin artículos",
        one: "{{count}} artículo",
        other: "{{count}} artículos",
      },
    },
  },
  defaultLocale: "en",
});

// English pluralization
hgts.t("items", { count: 0 }); // "No items"
hgts.t("items", { count: 1 }); // "1 item"
hgts.t("items", { count: 5 }); // "5 items"

// Spanish pluralization
hgts.changeLanguage("es");
hgts.t("items", { count: 0 }); // "Sin artículos"
hgts.t("items", { count: 1 }); // "1 artículo"
hgts.t("items", { count: 5 }); // "5 artículos"
```

**How it works:**

- When you pass a `count` parameter, HGTS automatically detects this is a plural translation
- It uses `Intl.PluralRules` to determine which plural form to use based on the current language
- Different languages have different pluralization rules (e.g., English: one/other, Polish: one/few/many/other)
- Falls back to `other` if the specific form is not provided
- You can provide a custom plural rule function in setup options if needed

**Custom plural rules (advanced):**

```javascript
hgts.setup({
  resources: {
    /* ... */
  },
  pluralRule: (count, locale) => {
    // Custom logic
    if (count === 0) return "zero";
    if (count === 1) return "one";
    return "other";
  },
});
```

### Fallback Behavior

```javascript
hgts.setup({
  resources: {
    en: {
      common: "Available in English",
      onlyEnglish: "Only in English",
    },
    es: {
      common: "Disponible en español",
      // 'onlyEnglish' is missing
    },
  },
  defaultLocale: "en",
  fallbackLocale: "en",
});

hgts.changeLanguage("es");
hgts.t("common"); // "Disponible en español"
hgts.t("onlyEnglish"); // "Only in English" (falls back to English)
```

### React Language Switcher

```tsx
function LanguageSwitcher() {
  const { changeLanguage, language, availableLanguages } = useTranslation();

  return (
    <div className="language-switcher">
      {availableLanguages().map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          className={language === lang ? "active" : ""}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

## 🔧 TypeScript Support

HGTS is written in TypeScript and includes full type definitions.

```typescript
import {
  hgts,
  HGTSOptions,
  Translations,
  InterpolationParams,
  PluralTranslation,
} from "hgts";

const options: HGTSOptions = {
  resources: {
    en: {
      greeting: "Hello!",
      items: {
        zero: "No items",
        one: "{{count}} item",
        other: "{{count}} items",
      },
    },
  },
  defaultLocale: "en",
};

const params: InterpolationParams = {
  name: "User",
  count: 5,
};

hgts.setup(options);
const translation: string = hgts.t("greeting", params);
const pluralTranslation: string = hgts.t("items", { count: 5 });
```

## 📂 Project Structure

```
hgts/
├── src/
│   ├── index.ts        # Core HGTS class
│   ├── types.ts        # TypeScript type definitions
│   └── react.ts        # React hook (optional)
├── dist/               # Compiled output
├── example/
│   ├── js-example.js   # JavaScript example
│   └── ts-example.ts   # TypeScript example
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 🙏 Acknowledgments

Inspired by the Holy Grail from the Fate series - a universal translator that enables communication across all languages.

---

Made with ❤️ by the Chaldea Foundation
