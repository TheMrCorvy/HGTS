import { hgts } from "hgts"; // In a real project, you would import from 'hgts'

// 1. Setup the translations with multiple languages
hgts.setup({
  resources: {
    en: {
      greeting: "Hello, World!",
      farewell: "Goodbye, World!",
      welcome: "Welcome, {{name}}!",
      itemCount: "You have {{count}} items in your cart.",
      nested: {
        message: "This is a nested message.",
        deep: {
          value: "Deep nested value",
        },
      },
    },
    es: {
      greeting: "¡Hola, Mundo!",
      farewell: "¡Adiós, Mundo!",
      welcome: "¡Bienvenido, {{name}}!",
      itemCount: "Tienes {{count}} artículos en tu carrito.",
      nested: {
        message: "Este es un mensaje anidado.",
        deep: {
          value: "Valor profundamente anidado",
        },
      },
    },
    fr: {
      greeting: "Bonjour, le Monde!",
      farewell: "Au revoir, le Monde!",
      welcome: "Bienvenue, {{name}}!",
      itemCount: "Vous avez {{count}} articles dans votre panier.",
      nested: {
        message: "Ceci est un message imbriqué.",
        deep: {
          value: "Valeur profondément imbriquée",
        },
      },
    },
  },
  defaultLocale: "en",
  fallbackLocale: "en",
});

// 2. Use the t function with default language (English)
console.log(hgts.t("greeting")); // Output: Hello, World!
console.log(hgts.t("farewell")); // Output: Goodbye, World!
console.log(hgts.t("nested.message")); // Output: This is a nested message.
console.log(hgts.t("nested.deep.value")); // Output: Deep nested value

// 3. Use interpolation
console.log(hgts.t("welcome", { name: "John" })); // Output: Welcome, John!
console.log(hgts.t("itemCount", { count: 5 })); // Output: You have 5 items in your cart.

// 4. Change language to Spanish
hgts.changeLanguage("es");
console.log(hgts.t("greeting")); // Output: ¡Hola, Mundo!
console.log(hgts.t("welcome", { name: "Juan" })); // Output: ¡Bienvenido, Juan!
console.log(hgts.t("nested.message")); // Output: Este es un mensaje anidado.

// 5. Change language to French
hgts.changeLanguage("fr");
console.log(hgts.t("greeting")); // Output: Bonjour, le Monde!
console.log(hgts.t("welcome", { name: "Pierre" })); // Output: Bienvenue, Pierre!

// 6. Check current language
console.log(hgts.getLanguage()); // Output: fr

// 7. Get available languages
console.log(hgts.getAvailableLanguages()); // Output: ['en', 'es', 'fr']

// 8. Test fallback (key doesn't exist in French)
hgts.changeLanguage("en");
console.log(hgts.t("non.existent.key")); // Output: non.existent.key (returns key when not found)
