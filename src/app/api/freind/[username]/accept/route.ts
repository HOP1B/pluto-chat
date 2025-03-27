import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Route to accept a friend request
 * @param req Client request containing required values
 * @param params Parameters containing the username of the friend to accept
 * @returns Response indicating the result of the operation
 *
 * @example
 * ```json
 * // Request
 * {
 *   // VERY quite around here ain it?
 * }
 *
 * // code 404
 * {
 *   "message": "User not found"
 * }
 *
 * // code 500
 * {
 *   "message": "PLEASE explain me how you got past the authentication (probably our security sucked lol)"
 * }
 *
 * // code 200
 * {
 *   "message": "Successfully added friend"
 * }
 * ```
 */
export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  // Get user
  const user_header = req.headers.get("_user");
  if (!user_header)
    return NextResponse.json(
      {
        message:
          "PLEASE explain me how you got past the authentication (probably our security sucked lol)",
      },
      { status: 500 }
    );
  const user: User = JSON.parse(user_header);

  // Yay freind
  const freind = await prisma.user.findFirst({
    where: { username: (await params).username },
  });
  if (!freind) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Remove the request
  await prisma.freindRequest.delete({
    where: {
      senderId_recieverId: {
        senderId: freind.id,
        recieverId: user.id,
      },
    },
  });

  // Sunshine lolipops and rainbow everywhere 🍭🍬🌻
  // As a jollytokker this is making me pmo! (Positivity Mode ON)
  await prisma.friendship.createMany({
    data: [
      {
        userId: user.id,
        friendId: freind.id,
      },
      {
        userId: freind.id,
        friendId: user.id,
      },
    ],
  });

  return NextResponse.json(
    { message: "Successfully added freind" },
    { status: 200 }
  );
};
