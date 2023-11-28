import { type ClassValue, clsx } from "clsx"

import { twMerge as merge } from "tailwind-merge"

export default function twMerge(...inputs: ClassValue[]) {
  return merge(clsx(inputs))
}
