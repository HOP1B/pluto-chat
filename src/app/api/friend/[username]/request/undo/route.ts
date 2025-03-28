import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Route to undo a friend request
 * @param req Client request containing required values
 * @param params Parameters containing the username of the friend to undo the request for
 * @returns Response indicating the result of the operation
 *
 * @example
 * ```json
 * // Request
 * {
 *   // Empty. Just plain emptiness.
 * }
 *
 * // code 404
 * {
 *   "message": "User not found"
 * }
 *
 * // code 500
 * {
 *   "message": "im so pmo rn"
 * }
 *
 * // code 200
 * {
 *   "message": "Successfully unrequested 'request' (???)"
 * }
 * ```
 */
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const userHeader = req.headers.get("_user");
  if (!userHeader)
    return NextResponse.json({ message: "im so pmo rn" }, { status: 500 });
  const user: User = JSON.parse(userHeader);
  const NOTfreindUsername = (await params).username;

  const NOTfreind = await prisma.user.findFirst({
    where: {
      username: NOTfreindUsername,
    },
  });

  if (!NOTfreind)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  await prisma.freindRequest.delete({
    where: {
      senderId_recieverId: {
        senderId: user.id,
        recieverId: NOTfreind.id,
      },
    },
  });

  return NextResponse.json(
    { message: "Successfully unrequested 'request' (???)" }, // TODO: Word this better or smth
    { status: 200 }
  );
};
