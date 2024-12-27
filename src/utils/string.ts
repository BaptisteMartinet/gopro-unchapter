const IsNumRegex = /^\d+$/;

export function isStrNum(str: string) {
  return IsNumRegex.test(str);
}
