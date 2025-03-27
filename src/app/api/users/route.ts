import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Get all users without private info
 * @returns res
 *
 * @example
 * ```json
 * // Request
 * {}
 *
 * // code 500
 * {
 *   "message": "Something went wrong"
 * }
 *
 * // code 200
 * [
 *   {
 *     "username": "vfsjknnfkvjnkf",
 *     "displayName": "vfsjknnfkvjnkf",
 *     "id": "vfsjknnfkvjnkf",
 *     "credential": "vfsjknnfkvjnkf"
 *   }
 * ]
 * ```
 */
export const GET = async () => {
  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true,
        email: true,
        phone_number: true,
      },
      include: {
        friendOf: true,
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch {
    // i guess the server db went down or smth i dunno
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
