/** Case-insensitive partial match on transaction title/description. */
export function matchesTransactionTitle(title: string, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return title.trim().toLowerCase().includes(needle);
}
