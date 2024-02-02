import { redirectWithClearedCookie } from "./auth/auth";

export function actionLogout() {
  return redirectWithClearedCookie();
}
