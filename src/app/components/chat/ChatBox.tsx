"use client";

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
// import { useChannel } from "ably/react";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Prisma } from "@prisma/client";
import { useContext } from "react";
import { UserContext } from "@/app/context/user-context";
import Ably from "ably";

// import markdownit from "markdown-it";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const markdownit = require("markdown-it");
import "./chat.css";

import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import axios, { AxiosResponse } from "axios";

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
      } catch { }
    }

    return "";
  },
});

const form_schema = z.object({
  message: z.string().trim().min(1),
});

const MESSAGE_SAVE_AMOUNT = 200;

dayjs.extend(relativeTime);

type ChatBoxProps = {
  channel: string;
};

const ably = new Ably.Realtime(`${process.env.ABLY_API_KEY}`);

export const ChatBox = (props: ChatBoxProps) => {
  const [shifted, setShifted] = useState<boolean>(false);
  const formRef = useRef(null);
  const form = useForm<z.infer<typeof form_schema>>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      message: "",
    },
  });

  const [messages, setMessages] = useState<
    Prisma.MessageGetPayload<{ include: { messenger: true; reciever: true } }>[]
  >([]);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const { accessToken } = useContext(UserContext);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // useChannel(props.channel, (message) => {
  //   const history = messages.slice(-MESSAGE_SAVE_AMOUNT);
  //   setMessages([...history, message.data]);
  // });

  const onSubmit = async (values: z.infer<typeof form_schema>) => {
    const message = values.message.trim();
    form.reset();
    if (message) {
      await axios.post(
        `/api/messages/${props.channel}`,
        {
          message,
        },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
    }
  };

  useEffect(() => {
    const channel = ably.channels.get(props.channel);
    // ! Maybe use this
    // channel.unsubscribe("message");
    channel.subscribe("message", (message) => {
      const history = messages.slice(-MESSAGE_SAVE_AMOUNT);
      console.log({ messages, history, m: message.data });
      setMessages([...history, message.data]);
    });
  }, [messages, props.channel]);

  useEffect(() => {
    axios
      .get(`/api/messages/${props.channel}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(
        (
          data: AxiosResponse<
            Prisma.MessageGetPayload<{
              include: { messenger: true; reciever: true };
            }>[]
          >
        ) => setMessages(data.data)
      );
  }, [accessToken, props.channel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col px-3 pb-2 h-[95%]">
      <ul className="h-full overflow-scroll scroll-smooth">
        {messages.map((message, index) => (
          <li key={message.id} className="flex gap-2 w-full">
            <div className="flex flex-col w-full">
              {(index === 0 ||
                (index > 0 &&
                  messages[index - 1].messenger === message.messenger) ||
                new Date(messages[index - 1].createdAt).getTime() -
                new Date(message.createdAt).getTime() <=
                -60 * 1000) && (
                  <div className={`flex ${index == 0 ? "mt-1" : ""}`}>
                    <div className="w-full flex-grow flex items-center">
                      <span className="text-xs mr-1">
                        {message.messenger.displayName}
                      </span>
                      <span className="text-[10px] opacity-75">
                        {message.messenger.username}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs whitespace-nowrap">
                        {dayjs().from(message.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
              <div className="w-full flex">
                <div
                  className="chat"
                  dangerouslySetInnerHTML={{
                    __html: md.render(message.message),
                  }}
                ></div>
              </div>
            </div>
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
                    autoFocus
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
          {/* <Button type="submit">Send</Button> */}
        </form>
      </Form>
    </div>
  );
};
