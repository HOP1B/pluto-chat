import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'asc'
      }
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
  const howdoinamethis = await prisma.message.create({ data: { message } });
  return NextResponse.json(howdoinamethis, { status: 200 });
};
