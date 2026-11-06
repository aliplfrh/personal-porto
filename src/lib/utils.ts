/**
 * Tiny class-name joiner. The codebase deliberately avoids the clsx/tailwind-merge
 * dependency; this covers the falsy-value filtering the UI components need.
 */
export type ClassValue = string | number | null | undefined | false | ClassValue[];

export function cn(...classes: ClassValue[]): string {
  const out: string[] = [];
  for (const value of classes) {
    if (!value && value !== 0) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
    } else {
      out.push(String(value));
    }
  }
  return out.join(' ');
}
