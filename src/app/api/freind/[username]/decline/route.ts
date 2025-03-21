import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Route to decline a friend request
 * @param req Client request containing required values
 * @param params Parameters containing the username of the friend to decline
 * @returns Response indicating the result of the operation
 *
 * @example
 * ```json
 * // Request
 * {
 *   // Empty handed? A little ungenerous don't you think?
 * }
 *
 * // code 404
 * {
 *   "message": "User not found"
 * }
 *
 * // code 500
 * {
 *   "message": "ok br wts wrn wt ts auth💔"
 * }
 *
 * // code 200
 * {
 *   "message": "Well that's one hope lost"
 * }
 * ```
 */
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  // Get user
  const userHeader = req.headers.get("_user");
  if (!userHeader) return NextResponse.json("ok br wts wrn wt ts auth💔");
  const user: User = JSON.parse(userHeader);

  // Get NOT freind (evil ahh)
  const NOTfreindUsername = (await params).username;
  const NOTfreind = await prisma.user.findFirst({
    where: { username: NOTfreindUsername },
  });
  if (!NOTfreind) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Man, jollytok would be so sad becasue of this
  await prisma.freindRequest.delete({
    where: {
      senderId_recieverId: {
        senderId: NOTfreind.id,
        recieverId: user.id,
      },
    },
  });

  return NextResponse.json(
    { message: "Well that's one hope lost" }, // poor guy
    { status: 200 }
  );
};
