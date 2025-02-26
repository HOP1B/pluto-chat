import { GetErrorMessage } from "@/lib/utils";
import { checkIfEmail, checkIfPhone, validatePassword } from "@/lib/validator";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/**
 * Route to sign up users
 * @param req Client request containing required values
 * @returns res
 *
 * @example
 * ```json
 * // Request
 * {
 *   "username": "pug",
 *   "password": "icl ts pmo rn 💔 ru fr rn🪫 u nt shkspr br 🥀",
 *   "credential": "neon@white.🪬"
 * }
 *
 * // code 400
 * {
 *   "message": "Username already taken"
 * }
 * {
 *   "message": "The password combos (such as Password must be 8 characters long)"
 * }
 * {
 *   "message": "Invalid credentials"
 * }
 *
 * // code 500
 * {
 *   "message": "Something went wrong"
 * }
 *
 * // code 201
 * {
 *   "blah blah": "user stuff such as username password display name and such"
 * }
 * ```
 */
export const POST = async (req: NextRequest) => {
  const { username, password, credential } = await req.json(); // Get the info

  // Check if user already exists
  try {
    const isNewUser = await prisma.user.findFirst({ where: { username } });
    if (isNewUser) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }

  // Check if password plays by the rules
  try {
    validatePassword(password);
  } catch (err) {
    return NextResponse.json(
      { message: GetErrorMessage(err) },
      { status: 400 }
    );
  }

  // Check if the credentials are correct
  if (!checkIfEmail(credential) && !checkIfPhone(credential)) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  // Get out salt so we could encrypt
  let salt = Number(process.env.BCRYPT_SALT_ROUNDS);
  if (isNaN(salt)) {
    console.log("BCRYPT salt not found! Using fallback.");
    salt = 10;
  }

  // Hash password
  const passhash = await bcrypt.hash(password, salt);

  // Create user
  try {
    const user = await prisma.user.create({
      data: {
        username,
        credential,
        password: passhash,
        displayName: username,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
