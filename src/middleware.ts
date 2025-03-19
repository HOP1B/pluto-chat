import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * This function chech's whether the given path (route) is in the EXCLUDED_ROUTES or EXCLUDED_DYNAMIC_ROUTES
 * @param url URL to be checked
 * @returns Whether it's in the excluded routes
 */
const CheckIfInExcludedPaths = (url: string) => {
  // Check if it's a normal url.
  if (EXCLUDED_ROUTES.includes(url)) {
    return true; // if yes return true
  } else {
    // Loop over every excluded dynamic paths
    for (const route of EXCLUDED_DYNAMIC_ROUTES) {
      // Check if the url starts with the dynamic route
      if (url.startsWith(route)) return true;
    }
  }
  return false;
};

export async function middleware(req: NextRequest) {
  // Check if the path is excluded. If yes just skip
  if (CheckIfInExcludedPaths(req.nextUrl.pathname)) return NextResponse.next();

  // Get full token from header
  const fullToken = req.headers.get("Authorization");
  // If not bearer just pass
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
  // Stop if there is no JWT_SECRET
  if (!JWT_SECRET) {
    console.log(
      "JWT secret missing. Please set JWT_SECRET in your environment."
    );
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }

  // i dunno why but turn the string into bits (maybe so jose could read it?)
  const secret = new TextEncoder().encode(JWT_SECRET);

  // Check the token and voila!
  try {
    const { payload } = await jwtVerify(token, secret);
    const response = NextResponse.next();
    response.headers.set("_user", JSON.stringify(payload.user));
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
  "/api/ably",
];

// Dynamic routes to be excluded
// e.g /api/users. Why? There are routes like /api/users/testuser1, /api/users/gffgobsro so it's not ideal to put all the usernames isn't it?
const EXCLUDED_DYNAMIC_ROUTES = ["/api/users"];

export const config = {
  matcher: ["/api/:path*"],
};
