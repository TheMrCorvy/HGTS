/**
 * User service module
 * This file uses translations without calling setup()
 */

import { hgts } from "hgts";

export class UserService {
  getUserProfileTitle(): string {
    return hgts.t("user.profile");
  }

  getUserSettingsTitle(): string {
    return hgts.t("user.settings");
  }

  getWelcomeMessage(userName: string): string {
    return hgts.t("welcome", { name: userName });
  }

  getItemCount(count: number): string {
    return hgts.t("items", { count });
  }
}
