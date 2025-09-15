// Frontend-only auth helpers using localStorage. Replace with real auth later.
// TODO: Replace with real token/session handling after backend integration

const AUTH_KEY = "bizEyeAuthed";

export function isAuthenticated() {
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch (e) {
    return false;
  }
}

export function login() {
  // TODO: On real login, store access token/refresh token securely (httpOnly cookie)
  try {
    localStorage.setItem(AUTH_KEY, "true");
  } catch (e) {
    // ignore
  }
}

export function logout() {
  // TODO: Revoke token via backend and clear auth state
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (e) {
    // ignore
  }
}

export default {
  isAuthenticated,
  login,
  logout,
};
