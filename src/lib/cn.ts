export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const pad = (n: number, size = 2) => String(n).padStart(size, '0')
