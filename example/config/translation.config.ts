/**
 * Centralized i18n configuration file
 * This file should be imported once at the start of your application
 * (e.g., in your main.ts, index.ts, or app entry point)
 */

import { hgts } from "hgts";

// Setup translations once
hgts.setup({
    resources: {
        en: {
            greeting: "Hello, World!",
            farewell: "Goodbye!",
            welcome: "Welcome, {{name}}!",
            items: {
                zero: "No items",
                one: "{{count}} item",
                other: "{{count}} items",
            },
            user: {
                profile: "User Profile",
                settings: "Settings",
            },
        },
        es: {
            greeting: "¡Hola, Mundo!",
            farewell: "¡Adiós!",
            welcome: "¡Bienvenido, {{name}}!",
            items: {
                zero: "Sin artículos",
                one: "{{count}} artículo",
                other: "{{count}} artículos",
            },
            user: {
                profile: "Perfil de Usuario",
                settings: "Configuración",
            },
        },
        fr: {
            greeting: "Bonjour, le Monde!",
            farewell: "Au revoir!",
            welcome: "Bienvenue, {{name}}!",
            items: {
                zero: "Aucun article",
                one: "{{count}} article",
                other: "{{count}} articles",
            },
            user: {
                profile: "Profil Utilisateur",
                settings: "Paramètres",
            },
        },
    },
    defaultLocale: "en",
    fallbackLocale: "en",
});

console.log("✅ HGTS configured successfully!");

// You can export the instance if you want, but it's not necessary
// The singleton pattern makes it accessible everywhere
export { hgts };
