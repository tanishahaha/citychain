import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function convertBlobUrlToFile(blobUrl: string, filename = "media"): Promise<File> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const fileType = blob.type.startsWith("video") ? "mp4" : "jpg"; // Detect type
  return new File([blob], `${filename}.${fileType}`, { type: blob.type });
}

