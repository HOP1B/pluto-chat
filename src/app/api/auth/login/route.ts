import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { checkIfPhone } from "@/lib/validator";
import { SignJWT } from "jose";

const prisma = new PrismaClient();

/**
 * Login route for users
 * @param req The client request
 * @returns Response with 4 different outcomes
 *
 * @example
 * // Request
 * {
 *   "logininfo": "deltarune@tomorrow.cope",
 *   "password": "deltarune tomorrow"
 * }
 *
 * // code 404
 * { "message": "User not found" }
 *
 * // code 400
 * { "message": "Incorrect password", "passed": false }
 *
 * // code 500
 * { "message": "Something went wrong" }
 *
 * // code 200
 * {
 *   "message": "Successfully logged in as 'deltarune tomorrow'",
 *   "passed": true,
 *   "accessToken": "long access token here..."
 * }
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  // Get info
  const { logininfo, password }: { logininfo: string; password: string } =
    await req.json();

  const credsQuery: {
    email?: string;
    phone_number?: number;
  } = {};

  if (checkIfPhone(logininfo)) {
    credsQuery.phone_number = Number(logininfo);
  } else {
    credsQuery.email = logininfo;
  }

  // Get user
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        credsQuery,
        {
          username: logininfo,
        },
      ],
    },
  });

  // Stop if user is not found
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Check the password
  const passed = await bcrypt.compare(password, user.password);
  if (!passed) {
    return NextResponse.json(
      { message: "Incorrect password", passed },
      { status: 400 }
    );
  }

  // Get secret and sign token with jose
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.log("JWT secret missing. Please set JWT_SECRET in your environment.");
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
  const secret = new TextEncoder().encode(JWT_SECRET);
  const accessToken = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10h")
    .sign(secret);

  return NextResponse.json(
    {
      message: "Successfully logged in as '" + user.username + "'",
      passed,
      accessToken,
    },
    { status: 200 }
  );
};
