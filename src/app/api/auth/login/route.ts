import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { checkIfPhone } from "@/lib/validator";

const prisma = new PrismaClient();

/**
 * Login route for users
 * @param req The client request
 * @returns Response with 4 different outcomes
 *
 * @example
 * ```json
 * // Request
 * {
 *   "logininfo": "deltarune@tomorrow.cope",
 *   "password": "deltarune tomorrow"
 * }
 *
 * // code 404
 * {
 *   "message": "User not found"
 * }
 *
 * // code 400
 * {
 *   "message": "Incorrect password",
 *   "passed": false
 * }
 *
 * // code 500
 * {
 *   "message": "Something went wrong"
 * }
 *
 * // code 200
 * {
 *   "message": "Successfully loggin in as 'deltarune tomorrow'",
 *   "passed": true,
 *   "accessToken": "gsoisjfgiojiogsfj gosh what a long accessToken jiofoijgfio"
 * }
 * ```
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  // Get info
  const { logininfo, password }: { logininfo: string; password: string } =
    await req.json();

  const credsQuery: {
    email?: string;
    phone_number?: number;
  } = {}; // either has email with string or phone_number with number

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

  // Stop if an user is not found
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Check the password
  const passed = await bcrypt.compare(password, user.password);

  // If not stop
  if (!passed) {
    return NextResponse.json(
      { message: "Incorrect password", passed },
      { status: 400 }
    );
  }

  // Get secret
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    // Always remember
    console.log("ARE YALL STUPID. GET THE DAMN JWT SECRET IN THE ENV");
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }

  // Get accessToken
  const accessToken = jwt.sign({ user }, JWT_SECRET, { expiresIn: "10h" });
  return NextResponse.json(
    {
      message: "Successfully logged in as '" + user.username + "'",
      passed,
      accessToken,
    },
    { status: 200 }
  );
};
