import Ably from "ably";
import { NextResponse } from "next/server";

export const revalidate = 0;

export const GET = async () => {
  if (!process.env.ABLY_API_KEY) {
    console.log("Yall forgot the ably api key. Please be carefull");
    return NextResponse.json(
      { message: "Look's like someone forgot something critial." },
      { status: 500 }
    );
  }
  const client = new Ably.Rest(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: "pluto-chat",
  });
  // console.log({ tokenRequestData });
  return NextResponse.json(tokenRequestData, { status: 200 });
};
