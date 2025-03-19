import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const messages = await prisma.message.findMany({
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

export const POST = async (req: NextRequest) => {
  const { message }: { message: string } = await req.json();

  // Get out user
  const userHeader = req.headers.get("_user");
  const user: User | null = userHeader ? JSON.parse(userHeader) : null;
  if (!user)
    return NextResponse.json(
      { message: "How did you even get past the middleware??" },
      { status: 500 }
    ); // Idk how this could happen tho. Maybe some weird bug that we didn't catch?

  const createdMessage = await prisma.message.create({
    data: {
      message: message,
      messenger: {
        connect: {
          id: user.id,
        },
      },
    },
    include: {
      messenger: true,
    },
  });
  return NextResponse.json(createdMessage, { status: 200 });
};
