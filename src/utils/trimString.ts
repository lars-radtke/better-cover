/**
 *
 * Removes unnecessary and duplicate spaces from a string.
 *
 * @param str - The input string to be trimmed.
 */
export function trimString(str: string): string {
  return str.trim().replace(/\s{2,}/g, " ");
}
