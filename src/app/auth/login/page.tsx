"use client";

// Form stuff
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// QOL
import axios from "axios";

// Imports
import { useContext, useState } from "react";
import { UserContext } from "@/app/context/user-context";
import Link from "next/link";
import { TrippyBackground } from "@/app/components/Common/TrippyBackground";

const FormSchema = z.object({
  logininfo: z.string(),
  password: z.string(),
});

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      logininfo: "",
      password: "",
    },
  });

  const { setAccessToken } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (loading) return;
    setLoading(true);
    await axios
      .post("/api/auth/login", {
        logininfo: values.logininfo,
        password: values.password,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err);
      });
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center h-screen text-black">
      <div className=" w-[1024px] h-[540px] bg-transparent p-4 border border-gray-300 rounded-2xl flex items-center justify-center">
      <div className=" w-[540px] h-[540px] p-10 bg-black rounded  ">
        <TrippyBackground></TrippyBackground>
      </div>
      <div className=" w-[540px] h-[540px] p-10 ">
      <Link href="/auth/register" className="text-4xl">
        Welcome back!
      </Link>
      <p>Doesn&apos;t have an account</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="logininfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email or Phone number"{...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input placeholder="Enter Password" type="password" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!loading ? <Button type="submit" className=" bg-black text-white w-full ">Log in</Button> : <p className=" h-[35px] bg-black text-white flex item-center justify-center">Signing in</p>}
        </form>
      </Form>
      </div>
      </div>
    </main>
  );
}
