export function saveUserSession(user_uuid: string) {
  localStorage.setItem("user_uuid", user_uuid);
}

export function getUserSession(): string | null {
  return localStorage.getItem("user_uuid");
}

export function clearUserSession() {
  localStorage.removeItem("user_uuid");
}
