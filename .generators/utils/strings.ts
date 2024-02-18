export function snakeToPascal(str: string) {
  return str
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function kebabToPascal(str: string) {
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function kebabToCamel(str: string) {
  const r = str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  return r.charAt(0).toLowerCase() + r.slice(1);
}
