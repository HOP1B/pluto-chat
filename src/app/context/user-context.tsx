"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { redirect, usePathname } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { ReactNode } from "react";

interface UserContextType {
  user: User | null;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  accessToken: "",
  setAccessToken: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);
  const [accessToken, setAccessToken] = useState<string>("");

  const path = usePathname();

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken") || "");
  }, []);

  useEffect(() => {
    localStorage.setItem("accessToken", accessToken || "");
    if (accessToken === "") {
      setUser(null);
      if (path !== "/auth/login" && path !== "/auth/register") {
        redirect("/auth/login");
      }
    }
    axios
      .get("/api/auth/me", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((res) => {
        setUser(res.data);
      })
      .then(() => redirect("/"))
      .catch(() => {
        setAccessToken("");
        setUser(null);
        redirect("/auth/login");
      });
  }, [accessToken, path]);

  return (
    <UserContext.Provider value={{ user, accessToken, setAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};
