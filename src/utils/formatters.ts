import {format} from "date-fns";

/**
 * Formats a phone number to +1-XXX-XXX-XXXX format
 */


export function formatPhone(n: number): string {
  return `+1-${n.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`;
}

/**
 * Formats a Date object to dd MMMM yyyy, hh:mm a format
 */
export function formatDate(d: Date | number): string {
  return format(d,"dd MMMM yyyy',' hh:mm a");
}
