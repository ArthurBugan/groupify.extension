import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export function getChannelUrl(
  contentType: string | undefined,
  url: string | undefined
): string {
  if (!url) return "#"

  console.log("contentType", contentType, url)

  switch (contentType) {
    case "anime":
      return `https://crunchyroll.com/series/${url}`
    case "youtube":
      return `https://youtube.com/channel/${url}`
    case "website":
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url
      }
      return `https://${url}`
    default:
      return url
  }
}
