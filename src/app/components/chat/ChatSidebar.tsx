"use client";

import { UserContext } from "@/app/context/user-context";
import { DialogHeader } from "@/components/ui/dialog";
import { User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ChatSideBar = () => {
  const { user, accessToken } = useContext(UserContext);
  const [sentRequest, setSentRequest] = useState(false);

  console.log(user);

  const [friends, setFriends] = useState<User[] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      axios
        .get("/api/friend", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => setFriends(res.data));
    }
  }, [accessToken, user]);

  if (!user) {
    return <></>;
  }

  return (
    <aside className="w-1/4 max-w-60 bg-neutral-800 p-4 flex flex-col border-r border-neutral-700">
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Chat</span>
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-2 bg-neutral-700 rounded hover:bg-neutral-600">
              +
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-neutral-700/100 text-white border-white rounded-xl">
            <DialogHeader>
              <DialogTitle>Add friend</DialogTitle>
              <DialogDescription>
                Find new friends so we could actually have users and not go
                bankrupt(talking like this goin do stuff).
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const friend = (e.target as HTMLFormElement).friend.value;
                console.log(sentRequest);
                if (sentRequest) {
                  axios
                    .post(
                      `/api/friend/${friend}/request`,
                      {},
                      { headers: { Authorization: `Bearer ${accessToken}` } }
                    )
                    .then((res) => {
                      toast({ title: res.data.message });
                      setSentRequest(true);
                    })
                    .catch((err) => {
                      console.log(err);
                      setSentRequest(false);
                      toast({ title: err.response.data.message });
                    });
                } else {
                  axios
                    .delete(`/api/friend/${friend}/request/undo`, {
                      headers: { Authorization: `Bearer ${accessToken}` },
                    })
                    .then((res) => {
                      toast({ title: res.data.message });
                      setSentRequest(false);
                    })
                    .catch((err) => {
                      console.log(err);
                      toast({ title: err.response.data.message });
                    });
                }
              }}
            >
              <Label>Your new future &apos;friend&apos;s username</Label>
              <div className="flex gap-2">
                <Input
                  name="friend"
                  id="friend"
                  placeholder="gauss, user12322346906 etc."
                  className="text-neutral-300 border-[1.5px]"
                />
                <Button type="submit" variant="outline">
                  {!sentRequest ? "Request" : "Undo"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Contact List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {friends !== null &&
          friends.length > 0 &&
          friends.map((user, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 bg-neutral-700 rounded cursor-pointer hover:bg-neutral-600"
            >
              <div className="w-10 h-10 bg-neutral-500 rounded-full flex items-center justify-center text-lg ">
                {user.displayName.charAt(0)}
              </div>
              <span>{user.displayName}</span>
            </div>
          ))}
        {friends == null && <p>Loading...</p>}
        {friends !== null && friends.length === 0 && (
          <p>Man you must be really 𝓯𝓻𝓮𝓪𝓴𝔂 at parties</p>
        )}
      </div>

      {/* Settings Button */}
      <button className="mt-4 p-2 bg-neutral-700 rounded hover:bg-neutral-600">
        Settings
      </button>
    </aside>
  );
};
