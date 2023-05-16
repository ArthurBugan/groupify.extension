import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Library } from "~components/ui/icon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export const getFamily = (family = '') => family.slice(0, 2).toLowerCase() as Library;