"use client";

import { TrippyBackground } from "./components/Common/TrippyBackground";

// import * as Ably from 'ably';
// import { AblyProvider, ChannelProvider } from 'ably/react';

// const client = new Ably.Realtime({key: process.env.ABLY_API_KEY});

export default function Home() {
  return (
    <main>
      <p>hi lol</p>
      <TrippyBackground></TrippyBackground>
      {/* <AblyProvider client={client}>
      <ChannelProvider channelName='main-chat'>
      </ChannelProvider>
      </AblyProvider>
      <div>hi lol</div> */}
    </main>
  );
}
