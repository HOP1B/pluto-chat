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

  console.log({ user, freind });

  console.log({
    req: await prisma.freindRequest.findFirst({
      where: {
        senderId: freind.id,
        recieverId: user.id,
      },
    }),
  });

  const freindRequest = await prisma.freindRequest.delete({
    where: {
      senderId_recieverId: {
        senderId: freind.id,
        recieverId: user.id,
      },
    },
  });

  console.log(freindRequest);

  const freindship = await prisma.friendship.createMany({
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

  console.log({ freindRequest, freindship });

  return NextResponse.json(
    { message: "Successfully added freind" },
    { status: 200 }
  );

  // if (!freindRequest)
  //   return NextResponse.json(
  //     { message: "No freind request found" },
  //     { status: 404 }
  //   );
};
