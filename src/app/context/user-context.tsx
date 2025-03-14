"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { redirect, usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { ReactNode } from "react";

// This is how our user context looks
interface UserContextType {
  user: User | null; // We have the User (which is the prisma user thing)
  accessToken: string; // We have the accessToken (idk maybe we could use it?)
  setAccessToken: React.Dispatch<React.SetStateAction<string>>; // SetAccessToken for login
}

// Here is our default context looks like
export const UserContext = createContext<UserContextType>({
  user: null, // Nothing as you expect
  accessToken: "", // token to the accesss of aaa a api i think uhh (BOIII 🤣🫱)
  setAccessToken: () => {}, // yeah it does absolutely nothing lol
});

// We DO NOT want this context to work on these routes
const FORBIDDENPATHS = ["/auth/login", "/auth/register"];

/**
 * This is our user related context provider.
 *
 * Currently this provider includes:
 * - User data
 * - Access token
 * - Access token setter
 *
 * Usage:
 * ```typescript
 * import { useContext } from "react";
 * import { UserContext } from "@/app/context/user-context";
 *
 * // ...
 *
 * const { user } = useContext(UserContext);
 * console.log(user);
 * ```
 */
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const router = useRouter();

  const path = usePathname();

  // Set token on load.
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token || "");
  }, []);

  // Do this every time you load in (change route's)
  useEffect(() => {
    if (accessToken === "") {
      if (
        !localStorage.getItem("accessToken") &&
        !FORBIDDENPATHS.includes(path)
      ) {
        console.log("Move or smth???");
        // So uhh if there is like really nothing just change the route
        redirect("/auth/login");
      }
      return;
    }
    // If there is a token set it.
    localStorage.setItem("accessToken", accessToken);

    // And request a token validation
    axios
      .get("/api/auth/me", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((res) => {
        // If nothing went wrong do set user and change path
        setUser(res.data);
        if (FORBIDDENPATHS.includes(path)) {
          router.push("/");
        }
      })
      .catch(() => {
        // BUT OH NO WRONG ACCESS TOKEN
        // yeah fire it gng
        setAccessToken("");
        setUser(null);
        redirect("/auth/login");
      });
  }, [accessToken, path, router]);

  return (
    <UserContext.Provider value={{ user, accessToken, setAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};
