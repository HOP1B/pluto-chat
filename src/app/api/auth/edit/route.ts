import { NextRequest, NextResponse } from "next/server";


export const PUT = async (req: NextRequest) => {
  const body = await req.formData();
  console.log(body.get("file"));
  return NextResponse.json({ message: "hi" });
};
