import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const userHeader = req.headers.get("_user");
  if (!userHeader) return NextResponse.json("ok br wts wrn wt ts auth💔");
  const user: User = JSON.parse(userHeader);
  const NOTfreindUsername = (await params).username;

  const NOTfreind = await prisma.user.findFirst({
    where: { username: NOTfreindUsername },
  });

  if (!NOTfreind) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

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
