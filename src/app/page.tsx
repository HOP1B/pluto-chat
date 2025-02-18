"use client";

import dynamic from "next/dynamic";
const Chat = dynamic(
  () => import("./components/chat/Chat").then((mod) => mod.Chat),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <main>
      <div>hi lol</div>
      <Chat></Chat>
    </main>
  );
}
