import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts the error message from an error
 * @param err The error you got. This can be instance of Error or be a string. If not any of them returns a blank string
 * @returns The error message
 *
 * @example
 * ```typescript
 * try {
 *   // ...
 * } catch(err) {
 *   return NextResponse.json({ message: GetErrorMessage(err) }, { status: 500 });
 * }
 * ```
 */
export function GetErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  } else if (typeof err === "string") {
    return err;
  }
  return "";
}
