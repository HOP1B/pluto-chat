import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * jngjfsjafdjo\
 * i wanna go home
 * im tired and i think i did good for the day
 * TODO: Add docs for the added stuff
 * @param url URL to be checked
 * @returns Whether it's not in the excluded routes
 */
const CheckIfNotInExcludedPaths = (url: string) => {
  if (EXCLUDED_ROUTES.includes(url)) {
    return true;
  } else {
    for (const i in EXCLUDED_DYNAMIC_ROUTES) {
      if (url.startsWith(i)) return false;
    }
  }
  return true;
};

export async function middleware(req: NextRequest) {
  if (CheckIfNotInExcludedPaths(req.nextUrl.pathname))
    return NextResponse.next();

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
  const secret = new TextEncoder().encode(JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret);
    const response = NextResponse.next();
    response.headers.set("_user", JSON.stringify(payload));
    return response;
  } catch {
    return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
  }
}

// All excluded STATIC routes
// e.g /api/users. Because we really dont need them there.
const EXCLUDED_ROUTES = [
  "/api",
  "/api/auth/login",
  "/api/auth/register",
  "/api/users",
];
// Dynamic routes to be excluded
// e.g /api/users. Why? There are routes like /api/users/testuser1, /api/users/gffgobsro so it's not ideal to put all the usernames isn't it?
const EXCLUDED_DYNAMIC_ROUTES = ["/api/users"];

export const config = {
  matcher: ["/api/:path*"],
};
