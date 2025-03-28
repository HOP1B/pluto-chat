"use client";

import { ChatInfo } from "@/app/components/chat/ChatInfo";
import { ChatMain } from "@/app/components/chat/ChatMain";
import { ChatSideBar } from "@/app/components/chat/ChatSidebar";
import { redirect, usePathname } from "next/navigation";

const checkIfValidPath = (path: string): string => {
  const wanted = path.split("~").sort().join("~");
  if (wanted === path) {
    return "";
  }
  return wanted;
};

export default function Page() {
  const path = usePathname();
  const channel = path.split("/chat/")[1];
  if (checkIfValidPath(channel)) redirect(`/chat/${checkIfValidPath(channel)}`);
  return (
    <div className="h-screen bg-neutral-900 text-white flex">
      <ChatSideBar></ChatSideBar>

      <ChatMain channel={channel}></ChatMain>

      <ChatInfo channel={channel}></ChatInfo>
    </div>
  );
}
