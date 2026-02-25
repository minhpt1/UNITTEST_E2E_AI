/**
 * Replaces placeholders in a template string with values from a mapping object.
 *
 * @param template  - The string containing placeholders to replace.
 * @param mapping   - Key/value pairs where each key matches a placeholder name.
 * @param delimiter - Delimiter that wraps placeholder names (default: "@@@").
 *                    If the delimiter has an even length and the two halves differ
 *                    (e.g. "{{}}"), the first half is used as the opening tag and
 *                    the second half as the closing tag.
 *                    Otherwise the full delimiter is used on both sides
 *                    (e.g. "@@@name@@@", "%name%", "__name__").
 * @returns The template string with all matched placeholders replaced.
 */
export function replaceValueInTemplate(
  template: string,
  mapping: Record<string, string>,
  delimiter: string = '@@@'
): string {
  const len = delimiter.length;
  let open: string;
  let close: string;

  if (len % 2 === 0) {
    const half = len / 2;
    const left = delimiter.slice(0, half);
    const right = delimiter.slice(half);
    if (left !== right) {
      open = left;
      close = right;
    } else {
      open = delimiter;
      close = delimiter;
    }
  } else {
    open = delimiter;
    close = delimiter;
  }

  let result = template;
  for (const [key, value] of Object.entries(mapping)) {
    const escapedOpen = open.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedClose = close.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`${escapedOpen}${escapedKey}${escapedClose}`, 'g');
    result = result.replace(pattern, value);
  }

  return result;
}
