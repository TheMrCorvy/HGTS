/**
 * Main application entry point
 * This demonstrates the recommended pattern:
 * 1. Import and run the config first
 * 2. Then import and use modules that consume translations
 */

// Step 1: Initialize i18n configuration FIRST
import "./config/i18n.config";

// Step 2: Import modules that use translations
import { UserService } from "./modules/user.service";
import {
  getGreeting,
  getFarewell,
  getCurrentLanguage,
  switchLanguage,
} from "./modules/greeting.utils";

console.log("\n=== Multi-File Example ===\n");

// Using greeting utils (different file than setup)
console.log("Current language:", getCurrentLanguage());
console.log(getGreeting()); // Output: Hello, World!
console.log(getFarewell()); // Output: Goodbye!

// Using UserService (different file than setup)
const userService = new UserService();
console.log(userService.getUserProfileTitle()); // Output: User Profile
console.log(userService.getWelcomeMessage("Alice")); // Output: Welcome, Alice!
console.log(userService.getItemCount(0)); // Output: No items
console.log(userService.getItemCount(1)); // Output: 1 item
console.log(userService.getItemCount(5)); // Output: 5 items

// Change language from another module
console.log("\n=== Switching to Spanish ===\n");
switchLanguage("es");

console.log(getGreeting()); // Output: ¡Hola, Mundo!
console.log(userService.getUserProfileTitle()); // Output: Perfil de Usuario
console.log(userService.getWelcomeMessage("María")); // Output: ¡Bienvenido, María!
console.log(userService.getItemCount(5)); // Output: 5 artículos

// Change language to French
console.log("\n=== Switching to French ===\n");
switchLanguage("fr");

console.log(getGreeting()); // Output: Bonjour, le Monde!
console.log(userService.getUserProfileTitle()); // Output: Profil Utilisateur
console.log(userService.getWelcomeMessage("Pierre")); // Output: Bienvenue, Pierre!
console.log(userService.getItemCount(3)); // Output: 3 articles

console.log("\n✅ All modules share the same HGTS instance!");
