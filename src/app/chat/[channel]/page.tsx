"use client";

// import { UserContext } from "@/app/context/user-context";
// import { Message } from "@prisma/client";
// import axios from "axios";
import { redirect, usePathname } from "next/navigation";
// import { useContext, useEffect, useState } from "react";

import dynamic from "next/dynamic";
const Chat = dynamic(
  () => import("../../components/chat/Chat").then((mod) => mod.Chat),
  {
    ssr: false,
  }
);

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
  console.log(channel);
  if (checkIfValidPath(channel)) redirect(`/chat/${checkIfValidPath(channel)}`);
  // const users = channel.split("~"); // For debugging rn i dont think we need it now

  // const [messages, setMessages] = useState<Message[]>([]);

  // const { accessToken } = useContext(UserContext);
  // useEffect(() => {
  //   if (accessToken) {
  //     axios
  //       .get(`/api/messages/${channel}`, {
  //         headers: { Authorization: "Bearer " + accessToken },
  //       })
  //       .then((res) => {
  //         setMessages(res.data);
  //       })
  //       .catch((err) => {
  //         alert(err.message);
  //       });
  //   }
  // }, [accessToken, channel]);

  // console.log(messages);
  // return (
  //   <main>
  //     Here is some stuff you might need
  //     <ul>
  //       <li>Path: {path}</li>
  //       <li>Channel: {channel}</li>
  //       <li>
  //         Between &apos;{users[0]}&apos; and &apos;{users[1]}&apos;
  //       </li>
  //       <li>Look at logs for users</li>
  //     </ul>
  //   </main>
  // );
  return <Chat channel={channel}></Chat>;
}
