"use client";
import Image from "next/image";
import { redirect } from "next/navigation";

// import { TrippyBackground } from "./components/Common/TrippyBackground";

// import * as Ably from 'ably';
// import { AblyProvider, ChannelProvider } from 'ably/react';

// const client = new Ably.Realtime({key: process.env.ABLY_API_KEY});

// import dynamic from "next/dynamic";
// const Chat = dynamic(
//   () => import("./components/chat/Chat").then((mod) => mod.Chat),
//   {
//     ssr: false,
//   }
// );

// import { Menu,ChevronLeft,ChevronRight } from 'lucide-react';

export default function Home() {
  redirect('/chat')
  return (
    <div className="h-screen bg-neutral-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-neutral-800 p-4 flex flex-col border-l border-neutral-700">
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Chat</span>
          <button className="p-2 bg-neutral-700 rounded hover:bg-neutral-600">
            +
          </button>
        </div>
        {/* Contact List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {["Alex", "Ace", "Ares", "Aerson", "GaussTricky", "Orgil"].map(
            (user, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 bg-neutral-700 rounded cursor-pointer hover:bg-neutral-600"
              >
                <div className="w-10 h-10 bg-neutral-500 rounded-full flex items-center justify-center text-lg ">
                  {user.charAt(0)}
                </div>
                <span>{user}</span>
              </div>
            )
          )}
        </div>

        {/* Settings Button */}
        <button className="mt-4 p-2 bg-neutral-700 rounded hover:bg-neutral-600">
          Settings
        </button>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-neutral-800">
        {/* Header */}
        <header className="bg-neutral-800 text-white p-3 flex items-center justify-between border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded bg-neutral-700 hover:bg-neutral-600"></button>
            <input
              type="text"
              placeholder="Search"
              className="bg-neutral-700 text-white px-3 py-1 rounded focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Image
              width={32}
              height={32}
              src="/LOGO.svg"
              className="w-8 h-8 rounded-full"
              alt="Group Icon"
            />
            <span className="font-semibold">...</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-neutral-700 rounded hover:bg-neutral-600"></button>
            <button className="p-2 bg-neutral-700 rounded hover:bg-neutral-600"></button>
            <button className="p-2 bg-neutral-700 rounded hover:bg-neutral-600">
              ⋮
            </button>
          </div>
        </header>

        {/* <Chat></Chat> */}
      </main>

      {/* RIGHT SIDEBAR (Group Info) */}
      <aside className="w-64 bg-neutral-800 border-l border-neutral-700 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Group Info</h3>
        </div>
        <div className="text-sm text-neutral-400 mb-4">
          <p>Files: 265 Photos</p>
        </div>
        <div className="text-sm text-neutral-400">
          <p>5 Members</p>
        </div>
      </aside>
    </div>
  );
}
