import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/utils.ts
export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// ✅ Formats file sizes in KB/MB/GB
export const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
};

// ✅ Delays execution (Useful for simulating network delays)
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));