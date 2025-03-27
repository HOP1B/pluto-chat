import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const userHeader = req.headers.get("_user");
  if (!userHeader)
    return NextResponse.json(
      { message: "gng just kill me 💔" },
      { status: 500 }
    );
  const user: User = JSON.parse(userHeader);
  const userWithFreinds = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
    include: {
      friends: {
        include: {
          friend: { omit: { password: true, email: true, phone_number: true } },
        },
      },
    },
  });

  if (!userWithFreinds)
    return NextResponse.json({ message: "User not found?" }, { status: 404 }); // ??

  const { friends } = userWithFreinds;

  const PUREfriends = friends.map((item) => item.friend);

  return NextResponse.json(PUREfriends);
};
