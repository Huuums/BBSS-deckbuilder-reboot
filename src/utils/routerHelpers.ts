const trimPathRegex = /^\/+|\/+$/g;

export function normalizePath(path: string, omitSlash = false) {
  const s = path.replace(trimPathRegex, "");
  return s ? (omitSlash || /^[?#]/.test(s) ? s : "/" + s) : "";
}
