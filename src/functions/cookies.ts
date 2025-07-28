export function saveToCookies(key = "", value = "") {
  localStorage.setItem(key, value);
}

export function getFromCookies(key = ""): string | null {
  return localStorage.getItem(key)
}
