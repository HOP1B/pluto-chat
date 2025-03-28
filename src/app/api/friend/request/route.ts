import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const userHeader = req.headers.get("_user");
  if (!userHeader)
    return NextResponse.json(
      { message: "I don't have the time to write an error message." },
      { status: 500 }
    );
  const user: User = JSON.parse(userHeader);
  const recievedRequests = await prisma.freindRequest.findMany({
    where: {
      recieverId: user.id,
    },
    include: {
      sender: {
        omit: { password: true, email: true, phone_number: true },
      },
    },
  });
  const sentUsers = recievedRequests.map((e) => e.sender);
  return NextResponse.json(sentUsers);
};
