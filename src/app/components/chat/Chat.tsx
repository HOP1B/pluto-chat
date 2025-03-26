"use client";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { ChatBox } from "./ChatBox";
import { useEffect } from "react";

type ChatBoxProps = {
  channel: string; // The freindship id for dms
};

export const Chat = (props: ChatBoxProps) => {
  const client = new Ably.Realtime({
    authUrl: "http://localhost:3000/api/ably",
  });

  useEffect(() => {
    return () => {
      client.close();
    };
  }, []);

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={props.channel}>
        <ChatBox channel={props.channel}></ChatBox>
      </ChannelProvider>
    </AblyProvider>
  );
};
