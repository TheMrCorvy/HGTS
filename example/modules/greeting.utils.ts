/**
 * Greeting utility module
 * This file also uses translations without calling setup()
 */

import { hgts } from "hgts";

export function getGreeting(): string {
  return hgts.t("greeting");
}

export function getFarewell(): string {
  return hgts.t("farewell");
}

export function getCurrentLanguage(): string {
  return hgts.getLanguage();
}

export function switchLanguage(locale: string): void {
  hgts.changeLanguage(locale);
  console.log(`Language changed to: ${locale}`);
}
