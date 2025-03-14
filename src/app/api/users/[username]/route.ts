import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Get's a single user without private info
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
 * {
 *   "username": "vfsjknnfkvjnkf",
 *   "displayName": "vfsjknnfkvjnkf",
 *   "id": "vfsjknnfkvjnkf",
 *   "credential": "vfsjknnfkvjnkf"
 * }
 * ```
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const { username } = await params;
  try {
    const user = await prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        username: true,
        password: false,
        displayName: true,
        email: true,
        phone_number: true,
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch {
    // i guess the server db went down or smth i dunno
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
