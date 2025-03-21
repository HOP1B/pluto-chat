"use client";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { ChatBox } from "./ChatBox";

type ChatBoxProps = {
  chatId: string; // The freindship id for dms
};

export const Chat = (props: ChatBoxProps) => {
  const client = new Ably.Realtime({ authUrl: "/api/ably" });

  console.log(props);
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="public-global">
        <ChatBox></ChatBox>
      </ChannelProvider>
    </AblyProvider>
  );
};
