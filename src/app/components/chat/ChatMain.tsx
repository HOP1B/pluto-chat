import { UserContext } from "@/app/context/user-context";
import { useContext } from "react";
import { Chat } from "./Chat";
import { PFP } from "./PFP";

type Props_ChatMain = {
  channel?: string;
};

export const ChatMain = (props: Props_ChatMain) => {
  const { user } = useContext(UserContext);
  if (!user) return <></>;
  return (
    <main className="flex-1 flex flex-col bg-neutral-800">
      {/* Header */}
      <header className="bg-neutral-800 text-white p-3 flex items-center justify-end border-b border-neutral-700">
        {/* <div className="flex items-center space-x-3">
            <button className="p-2 rounded bg-neutral-700 hover:bg-neutral-600"></button>
            <input
              type="text"
              placeholder="Search"
              className="bg-neutral-700 text-white px-3 py-1 rounded focus:outline-none"
            />
          </div> */}
        {/* <DialogTrigger asChild> */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 text-center text-sm">
            <span className="opacity-75 text-[12px]">{user.username}</span>
            <span>{user.displayName}</span>
          </div>
          <button className="flex items-center space-x-2">
            <PFP displayName={user.displayName} size={32} />
            {/* <span className="font-semibold">...</span> */}
          </button>
        </div>
        {/* </DialogTrigger> */}
        {/* <div className="flex items-center space-x-3">
            <button className="p-2 bg-neutral-700 rounded hover:bg-neutral-600"></button>
            <button className="p-2 bg-neutral-700 rounded hover:bg-neutral-600"></button>
            <button className="p-2 bg-neutral-700 rounded hover:bg-neutral-600">
              ⋮
            </button>
          </div> */}
      </header>

      {props.channel ? (
        <Chat channel={props.channel}></Chat>
      ) : (
        <p>what am i supposed to put here</p>
      )}
    </main>
  );
};
