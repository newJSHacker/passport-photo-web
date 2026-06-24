export const ADMIN_SESSION_COOKIE = "admin_session";

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin123";
const DEFAULT_SESSION_TOKEN = "dev-admin-session-token-change-me";

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
}

export function getAdminSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN ?? DEFAULT_SESSION_TOKEN;
}

export function isValidAdminCredentials(
  username: string,
  password: string,
): boolean {
  return username === getAdminUsername() && password === getAdminPassword();
}

export function isValidAdminSession(sessionValue: string | null | undefined): boolean {
  return Boolean(sessionValue) && sessionValue === getAdminSessionToken();
}
