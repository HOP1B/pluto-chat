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
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="logininfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credentials</FormLabel>
                <FormControl>
                  <Input placeholder="Yharim24XxxY" {...field} />
                </FormControl>
                <FormDescription>Here goes your credentials</FormDescription>
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
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormDescription>This is your password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!loading ? <Button type="submit">Submit</Button> : <p>Signing in</p>}
        </form>
      </Form>
    </main>
  );
}
