import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Escape PostgREST special characters to prevent filter injection in .or() queries */
export function sanitizePostgrestQuery(query: string): string {
  return query
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/,/g, "\\,")
    .replace(/\./g, "\\.")
}
