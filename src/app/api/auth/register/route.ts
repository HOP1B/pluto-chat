import { checkIfEmail, checkIfPhone, validatePassword } from "@/lib/validator";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    username,
    credential,
    password,
  }: { username: string; credential: string; password: string } = body;
  try {
    validatePassword(password);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 400 });
    } else if (typeof err === "string") {
      return NextResponse.json({ message: err }, { status: 400 });
    }
  }
  try {
    const isNewUser = await prisma.user.findUnique({ where: { username } });
    if (isNewUser !== null) {
      return NextResponse.json(
        { message: "Username already in use" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
  if (!(checkIfEmail(credential) || checkIfPhone(credential))) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }
  const salt: number = Number(process.env.BCRYPT_SALT_ROUNDS || "10");
  let passhash = "";
  await bcrypt.hash(password, salt).then(function (hash: string) {
    passhash = hash;
  });
  try {
    const user = await prisma.user.create({
      data: {
        username,
        credential,
        password: passhash,
        displayName: username,
      },
    });
    return NextResponse.json({
      message: "Successfully signed up!",
      data: user,
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
