import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const { logininfo, password }: { logininfo: string; password: string } =
    await req.json();
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          credential: logininfo,
        },
        {
          username: logininfo,
        },
      ],
    },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const passed = await bcrypt.compare(password, user.password);
  if (!passed) {
    return NextResponse.json(
      { message: "Password incorrect", passed },
      { status: 400 }
    );
  }

  const JWT_SECRET =
    process.env.JWT_SECRET || "well it looks like someone forgot the secret";
  const accessToken = jwt.sign({ user }, JWT_SECRET, { expiresIn: "10h" });
  return NextResponse.json({
    message: "Successfully logged in as " + user.username,
    passed,
    accessToken,
  });
};
