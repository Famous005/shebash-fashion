/**
 * Format a price string from the API (e.g. "28000.00") as ₦28,000
 */
export function formatNaira(value: string | number): string {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}