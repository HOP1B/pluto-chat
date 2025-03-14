"use client";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { ChatBox } from "./ChatBox";

export const Chat = () => {
  const client = new Ably.Realtime({ authUrl: "/api/ably" });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="main-chat">
        <ChatBox></ChatBox>
      </ChannelProvider>
    </AblyProvider>
  );
};
