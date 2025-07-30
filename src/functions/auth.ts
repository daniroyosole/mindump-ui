export function saveUserSession(user_uuid: string) {
  localStorage.setItem("mindump-token", user_uuid);
}

export function getUserSession(): string | null {
  return localStorage.getItem("mindump-token");
}

export function clearUserSession() {
  localStorage.removeItem("mindump-token");
}
