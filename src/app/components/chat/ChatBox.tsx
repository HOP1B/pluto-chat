"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useChannel } from "ably/react";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const form_schema = z.object({
  message: z.string().trim().min(1),
});

const MESSAGE_SAVE_AMOUNT = 200;

type Message = {
  id: string;
  message: string;
  createdAt: Date;
};

dayjs.extend(relativeTime);

export const ChatBox = () => {
  const form = useForm<z.infer<typeof form_schema>>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      message: "",
    },
  });

  const [messages, setMessages]: [
    Message[],
    Dispatch<SetStateAction<Message[]>>
  ] = useState<Message[]>([]);

  const { channel /*, ably*/ } = useChannel("main-chat", (message) => {
    const history = messages.slice(-MESSAGE_SAVE_AMOUNT);
    setMessages([...history, message.data]);
  });

  const onSubmit = async (values: z.infer<typeof form_schema>) => {
    form.reset();
    const message: Message = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        message: values.message,
      }),
    }).then((res) => res.json());
    channel.publish({ name: "chat-message", data: message });
  };

  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  return (
    <section>
      <ul>
        {messages.map((message: Message) => (
          <li key={message.id} className="flex">
            <span className="flex-grow">{message.message}</span>
            <span>{dayjs().from(message.createdAt)}</span>
          </li>
        ))}
      </ul>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  {/* <Textarea
                    placeholder="Message goes here"
                    className="resize-none"
                    {...field}
                  /> */}
                  <Input
                    placeholder="Message goes here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                {/* <FormMessage></FormMessage> */}
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Send</Button>
        </form>
      </Form>
    </section>
  );
};
