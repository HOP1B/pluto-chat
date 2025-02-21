"use client";

import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { userId } = useAuth();
  console.log(userId);
  return <div>hi lol</div>;
}
