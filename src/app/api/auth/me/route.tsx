import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
  return NextResponse.json(req.headers.get("_user"), { status: 200 });
};
