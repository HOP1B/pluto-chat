import { NextResponse } from "next/server";

/**
 * Index of our API
 * @returns res
 * 
 * @example
 * ```json
 * // Why do you need an example?
 * ```
 */
export const GET = (): NextResponse<{ message: string }> => {
  // Hiiii
  return NextResponse.json({ message: "Welcome to the API!" }, { status: 200 });
};
