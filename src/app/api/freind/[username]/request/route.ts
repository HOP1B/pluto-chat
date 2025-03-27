import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const primsa = new PrismaClient();

/**
 * Route to send a friend request
 * @param req Client request containing the headers with user info
 * @param params Parameters containing the username of the intended friend
 * @returns Response indicating the result of the operation
 *
 * @example
 * // Request
 * {
 *   // sfgaijfijogfagafoifgaioaoi im smoking crack rn 🤣 gfsogdsjfksdjfksjdfs
 * }
 *
 * // code 500
 * {
 *   "message": "Please explain how you got past the authentication. Or more likely we just found a new bug."
 * }
 *
 * // code 404
 * {
 *   "message": "User not found"
 * }
 *
 * // code 400
 * {
 *   "message": "You are always your own enemy"
 * }
 *
 * // code 200
 * {
 *   "message": "Successfully sent request!"
 * }
 */
export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  // Get user
  const user_header: null | string = req.headers.get("_user");
  if (!user_header)
    return NextResponse.json(
      {
        message:
          "Please explain how you got past the authentication. Or more likely we just found a new bug.",
      },
      { status: 500 }
    );
  const user: User =
    JSON.parse(user_header);

  // Get 'freind'
  const freind = await primsa.user.findFirst({
    where: { username: (await params).username },
    include: {
      recievedRequests: true,
    },
  });
  if (!freind) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Check if the reqeust is already made
  const existingFreindRequest = await primsa.freindRequest.findFirst({
    where: {
      OR: [
        {
          senderId: freind.id,
          recieverId: user.id,
        },
        {
          recieverId: freind.id,
          senderId: user.id,
        },
      ],
    },
  });

  // If true just send them back
  if (existingFreindRequest) {
    return NextResponse.json({ message: "Can't send freind request twice" });
    // TODO: Maybe make this work but we don't have enough time now
    // if (existingFreindRequest.recieverId === user.id) {
    //   console.log("hi");
    //   return NextResponse.redirect(`/api/freind/${freind.username}/accept`);
    // }
    // if (existingFreindRequest.senderId === user.id) {
    // }
  }

  // ! This is from that one todo
  // return NextResponse.json(
  //   { message: "You are always your own enemy" },
  //   { status: 400 }
  // ); //so sigma
  // // yall ts is js satir

  // Check if the request is for himself
  if (user.username == freind.username || user.id == freind.id) {
    return NextResponse.json(
      { message: "You are always your own enemy" },
      { status: 400 }
    ); //so sigma
    // yall ts is js satir
  }

  // SMC: Freind?
  // SMC: ..!!!!
  const freind_question_mark = await primsa.freindRequest.create({
    data: {
      sender: { connect: { id: user.id } },
      reciever: { connect: { id: freind.id } },
    },
  });

  // Set the users request boxes
  await primsa.user.update({
    where: {
      id: user.id,
    },
    data: {
      sentRequests: {
        connect: { id: freind_question_mark.id },
      },
    },
  });

  await primsa.user.update({
    where: {
      id: freind.id,
    },
    data: {
      recievedRequests: {
        connect: { id: freind_question_mark.id },
      },
    },
  });

  return NextResponse.json({ message: "Successfully sent request!" });
};
