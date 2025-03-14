"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { useChannel } from "ably/react";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Message } from "@prisma/client";
import { useContext } from "react";
import { UserContext } from "@/app/context/user-context";

// import markdownit from "markdown-it";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const markdownit = require("markdown-it");
import "./chat.css";

import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import axios from "axios";

const md = markdownit({
  html: false,
  xhtmlOut: true,
  breaks: true,
  linkify: true,

  typographer: false,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre><code class="hljs">` +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch {}
    }

    return "";
  },
});

const form_schema = z.object({
  message: z.string().trim().min(1),
});

const MESSAGE_SAVE_AMOUNT = 200;

dayjs.extend(relativeTime);

export const ChatBox = () => {
  const [shifted, setShifted] = useState<boolean>(false);
  const formRef = useRef(null);
  const form = useForm<z.infer<typeof form_schema>>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      message: "",
    },
  });

  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const { accessToken } = useContext(UserContext);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { channel /*, ably*/ } = useChannel("main-chat", (message) => {
    const history = messages.slice(-MESSAGE_SAVE_AMOUNT);
    setMessages([...history, message.data]);
  });

  const onSubmit = async (values: z.infer<typeof form_schema>) => {
    form.reset();
    // const message: Message = await fetch("/api/messages", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     message: values.message,
    //   }),
    // }).then((res) => res.json());
    const message: Message = await axios.post(
      "/api/messages",
      {
        message: values.message,
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    channel.publish({ name: "chat-message", data: message });
  };

  useEffect(() => {
    fetch("/api/messages", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [accessToken]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen flex flex-col">
      <ul className="flex-grow overflow-scroll scroll-smooth">
        {messages.map((message) => (
          <li key={message.id} className="flex">
            {/* <span className="flex-grow whitsp">{message.message}</span> */}
            <div className="flex-grow">
              <div
                className="chat"
                dangerouslySetInnerHTML={{ __html: md.render(message.message) }}
              ></div>
              {/* {console.log(md.render(message.message))}
              <button onClick={() => {
                console.log(typeof md.render(message.message))
              }}>help?</button> */}
            </div>
            <span>{dayjs().from(message.createdAt)}</span>
          </li>
        ))}
        <div className="guesswhythisisused" ref={messagesEndRef}></div>
      </ul>
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    onKeyDown={(e) => {
                      const isShiftKey = e.key === "Shift";
                      if (isShiftKey) {
                        setShifted(true);
                      }
                      if (e.key === "Enter" && !shifted) {
                        onSubmit(form.getValues());
                      }
                    }}
                    onKeyUp={(e) => {
                      if (e.key === "Shift") {
                        setShifted(false);
                      }
                    }}
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
    </div>
  );
};
