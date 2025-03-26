import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Ably from "ably";

const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ channel: string }> }
) => {
  const users = (await params).channel.split("~").sort();
  const requesterHeader = req.headers.get("_user");
  if (!requesterHeader)
    return NextResponse.json(
      { message: "I can't describe my pain" },
      { status: 500 }
    );
  const requester: User = JSON.parse(requesterHeader);
  if (requester.id !== users[0] && requester.id !== users[1]) {
    return NextResponse.json({ message: "Oh no you wont :)" }, { status: 400 });
  }
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

  const createdMessage = await prisma.message.create({
    data: {
      messenger: { connect: { id: user.id } },
      reciever: { connect: { id: receiver } },
      message,
    },
    include: {
      messenger: true,
      reciever: true,
    },
  });

  const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY || "" });
  const channelId = users.join("~");
  const channel = ably.channels.get(channelId);
  channel.publish("message", createdMessage);

  return NextResponse.json(createdMessage, { status: 200 });
};
