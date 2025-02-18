"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useChannel } from "ably/react";

const form_schema = z.object({
  message: z.string().trim().min(1),
});

const MESSAGE_SAVE_AMOUNT = 200;

export const ChatBox = () => {
  const form = useForm<z.infer<typeof form_schema>>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      message: "",
    },
  });

  const [messages, setMessages]: [
    string[],
    Dispatch<SetStateAction<string[]>>
  ] = useState<string[]>([]);

  const { channel /*, ably*/ } = useChannel("main-chat", (message) => {
    const history = messages.slice(-MESSAGE_SAVE_AMOUNT);
    setMessages([...history, message.data]);
  });

  const onSubmit = (values: z.infer<typeof form_schema>) => {
    channel.publish({ name: "chat-message", data: values.message });
    form.reset();
  };

  console.log(messages);

  return (
    <section>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
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
