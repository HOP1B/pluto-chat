import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ channel: string }> }
) => {
  const users = (await params).channel.split("~").sort();
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            messengerId: users[0],
            recieverId: users[1],
          },
          {
            messengerId: users[1],
            recieverId: users[0],
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      // Get the user's data
      include: {
        messenger: {
          select: {
            displayName: true,
            username: true,
          },
        },
        reciever: {
          select: {
            displayName: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ channel: string }> }
) => {
  const { message }: { message: string } = await req.json();

  // Get out user
  const userHeader = req.headers.get("_user");
  if (!userHeader)
    return NextResponse.json(
      { message: "How did you even get past the middleware??" },
      { status: 500 }
    ); // Idk how this could happen tho. Maybe some weird bug that we didn't catch?
  const user: User = JSON.parse(userHeader);

  const users = (await params).channel.split("~").sort();
  const receiver = users.filter((e) => e !== user.id)[0];
  if (user.id !== users.filter((e) => e === user.id)[0]) {
    return NextResponse.json({ message: "nice try lil bro" }, { status: 400 });
  }

  console.log({ user: user.id, receiver, message });

  const createdMessage = await prisma.message.create({
    data: {
      messenger: { connect: { id: user.id } },
      reciever: { connect: { id: receiver } },
      message,
    },
    // include: {
    //   messenger: true,
    // },
  });
  return NextResponse.json(createdMessage, { status: 200 });
};
