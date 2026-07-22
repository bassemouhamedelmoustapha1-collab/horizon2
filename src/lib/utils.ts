/**
 * Concatène des classes conditionnelles (équivalent minimal de `clsx`).
 * Suffisant pour nos composants : les surcharges passées via `className`
 * s'ajoutent à la base sans conflit.
 */
export function cn(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}
