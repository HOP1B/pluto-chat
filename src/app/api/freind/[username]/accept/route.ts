import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const user_header = req.headers.get("_user");
  if (!user_header)
    return NextResponse.json(
      {
        message:
          "PLEASE explain me how you got past the authentication (probably our security sucked lol)",
      },
      { status: 500 }
    );
  const user: Prisma.UserGetPayload<{ include: { recievedRequests: true } }> =
    JSON.parse(user_header);
  const freind = await prisma.user.findFirst({
    where: { username: (await params).username },
  });

  if (!freind) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await prisma.freindRequest.delete({
    where: {
      senderId_recieverId: {
        senderId: freind.id,
        recieverId: user.id,
      },
    },
  });

  await prisma.friendship.createMany({
    data: [
      {
        userId: user.id,
        freindId: freind.id,
      },
      {
        userId: freind.id,
        freindId: user.id,
      },
    ],
  });

  return NextResponse.json(
    { message: "Successfully added freind" },
    { status: 200 }
  );
};
