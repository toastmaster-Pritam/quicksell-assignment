/**
 * Formats a phone number to +1-XXX-XXX-XXXX format
 */
export function formatPhone(n: number): string {
  return `+1-${n.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`;
}

/**
 * Formats a Date object to YYYY-MM-DD HH:MM format
 */
export function formatDate(d: Date | number): string {
  const dt = (d instanceof Date) ? d : new Date(d);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}