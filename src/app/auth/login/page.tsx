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
    <main className="flex items-center justify-center w-screen h-screen bg-cover bg-center text-black bg-[url('/background.login.jpg')]">
      <div className=" w-[1024px] h-[540px] bg-black bg-opacity-50 text-white p-4 border border-gray-300 rounded-2xl flex items-center justify-center">
      <div className=" w-[540px] h-[540px] p-10">
        <TrippyBackground></TrippyBackground>
        <button type="submit" className="w-[50px] h-[2px] border relative left-[180px] "></button>
      </div>
      <div className=" w-[540px] h-[540px] p-10 flex-row content-around items-center justify-center ">
      <p className="text-4xl">
        Welcome back!
      </p>
      <Link href="/auth/register" className="text-gray-300">Doesn&apos;t have an account</Link>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="logininfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input className="text-gray-200 rounded-xl" placeholder="Enter Email or Username"{...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className="text-gray-200 rounded-xl" placeholder="Enter Password" type="password" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!loading ? <Button type="submit" className=" bg-gray-500 text-white w-full rounded-xl ">Log in</Button> :<p>...</p>}
        </form>
      </Form>
      </div>
      </div>
    </main>
  );
}
