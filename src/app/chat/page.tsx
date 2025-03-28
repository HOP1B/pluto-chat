"use client";
import { useContext } from "react";
import { UserContext } from "../context/user-context";
import { ChatSideBar } from "../components/chat/ChatSidebar";
import { ChatMain } from "../components/chat/ChatMain";
import { ChatInfo } from "../components/chat/ChatInfo";

export default function Home() {
  const { user } = useContext(UserContext);
  if (!user) return;

  return (
    <div className="h-screen bg-neutral-900 text-white flex">
      <ChatSideBar></ChatSideBar>

      <ChatMain></ChatMain>

      <ChatInfo></ChatInfo>
    </div>
  );
}
