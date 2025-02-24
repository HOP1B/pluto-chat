"use client";

import { useAuth } from "@clerk/nextjs";
import { TrippyBackground } from "./components/Common/TrippyBackground";

export default function Home() {
  const { userId } = useAuth();
  return (
    <div>
      <p>hi lol</p>
      <p>{userId}</p>
      <TrippyBackground></TrippyBackground>
    </div>
  );
}
