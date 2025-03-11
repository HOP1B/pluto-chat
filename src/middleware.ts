import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname === "/api/auth/login" ||
    req.nextUrl.pathname === "/api/auth/register"
  )
    return;
  const fullToken = req.headers.get("Authorization");
  if (!fullToken || !fullToken.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Bad authorization headers" },
      { status: 400 }
    );
  }

  // Use the token after "Bearer "
  const token = fullToken.split(" ")[1];

  // Get secret from env
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.log(
      "JWT secret missing. Please set JWT_SECRET in your environment."
    );
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Optionally, attach decoded info to response headers or use as needed
    const response = NextResponse.next();
    response.headers.set("_user", JSON.stringify(decoded));
    return response;
  } catch {
    // console.log("err: " + err.message);
    return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*", "/api/auth/login", "/api/auth/signup"],
};
