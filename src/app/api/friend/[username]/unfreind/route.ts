import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Route to unfriend a user
 * @param req Client request containing headers with user info
 * @param params Parameters containing the username of the user to unfriend
 * @returns Response indicating the result of the operation
 *
 * @example
 * // Request
 * {
 *   // empty request empty request empty request empty request empty request empty request
 * }
 *
 * // code 500
 * {
 *   "message": "look im not even gonna write an error message"
 * }
 *
 * // code 404
 * {
 *   "message": "User not found"
 * }
 *
 * // code 200
 * {
 *   "message": "Successfully unfreinded"
 * }
 */
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const userHeader = req.headers.get("_user");
  if (!userHeader)
    return NextResponse.json(
      { message: "look im not even gonna write an error message" },
      { status: 500 }
    ); // look, it gets to a point
  const user: User = JSON.parse(userHeader);

  const NOTfreindUsername = (await params).username;
  const NOTfreind = await prisma.user.findFirst({
    where: { username: NOTfreindUsername },
  });
  if (!NOTfreind)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  await prisma.friendship.deleteMany({
    where: {
      OR: [
        {
          userId: user.id,
          friendId: NOTfreind.id,
        },
        {
          userId: NOTfreind.id,
          friendId: user.id,
        },
      ],
    },
  });

  return NextResponse.json({ message: "Successfully unfreinded" });
};
