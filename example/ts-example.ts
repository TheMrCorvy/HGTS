import { hgts } from "hgts"; // In a real project, you would import from 'hgts'

// 1. Setup the translations with multiple languages
hgts.setup({
    resources: {
        en: {
            greeting: "Hello, World!",
            farewell: "Goodbye, World!",
            welcome: "Welcome, {{name}}!",
            itemCount: "You have {{count}} items in your cart.",
            // Plural forms
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
            // Plural forms in Spanish
            items: {
                zero: "Sin artículos",
                one: "{{count}} artículo",
                other: "{{count}} artículos",
            },
            notifications: {
                zero: "No tienes notificaciones",
                one: "Tienes {{count}} notificación",
                other: "Tienes {{count}} notificaciones",
            },
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
            // Plural forms in French
            items: {
                zero: "Aucun article",
                one: "{{count}} article",
                other: "{{count}} articles",
            },
            notifications: {
                zero: "Vous n'avez aucune notification",
                one: "Vous avez {{count}} notification",
                other: "Vous avez {{count}} notifications",
            },
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

// 9. Pluralization examples
console.log("\n=== Pluralization Examples ===");
console.log(hgts.t("items", { count: 0 })); // Output: No items
console.log(hgts.t("items", { count: 1 })); // Output: 1 item
console.log(hgts.t("items", { count: 5 })); // Output: 5 items
console.log(hgts.t("items", { count: 100 })); // Output: 100 items

console.log(hgts.t("notifications", { count: 0 })); // Output: You have no notifications
console.log(hgts.t("notifications", { count: 1 })); // Output: You have 1 notification
console.log(hgts.t("notifications", { count: 10 })); // Output: You have 10 notifications

// 10. Pluralization in different languages
hgts.changeLanguage("es");
console.log("\n=== Pluralización en Español ===");
console.log(hgts.t("items", { count: 0 })); // Output: Sin artículos
console.log(hgts.t("items", { count: 1 })); // Output: 1 artículo
console.log(hgts.t("items", { count: 5 })); // Output: 5 artículos

hgts.changeLanguage("fr");
console.log("\n=== Pluralisation en Français ===");
console.log(hgts.t("items", { count: 0 })); // Output: Aucun article
console.log(hgts.t("items", { count: 1 })); // Output: 1 article
console.log(hgts.t("items", { count: 5 })); // Output: 5 articles
