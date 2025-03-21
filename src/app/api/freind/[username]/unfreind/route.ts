import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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
          freindId: NOTfreind.id,
        },
        {
          userId: NOTfreind.id,
          freindId: user.id,
        },
      ],
    },
  });

  return NextResponse.json({ message: "Successfully unfreinded" });
};
