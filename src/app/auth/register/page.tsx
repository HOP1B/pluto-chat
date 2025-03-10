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

// Resolvers
import { checkIfValidUsername } from "@/lib/validator";

// Imports
import { useEffect, useState } from "react";

/**
 * Returns a bool depending on the username avaivability
 * @param username Username to be checked
 * @returns Whether the username is already taken or not
 */
const CheckUsernameAvaivability = async (username: string) => {
  const user = await axios
    .get("/api/users/" + username)
    .then((response) => response.data)
    .catch((err) => {
      alert(err);
      console.log(err);
    });
  if (user) return false;
  return true;
};

const FormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be atleast 3 characters")
    .max(20, "Username must be atmost 20 characters")
    .refine(
      checkIfValidUsername,
      "Please use letters, numbers, underscores (_) and periods (.)."
    ),
  email: z.string().email("Not a valid email"),
  password: z
    .string()
    .min(8, "Password's must be atleast 8 characters long")
    .max(100, "Password's must be shorter than 100 characters")
    .regex(/\d/, "Password must contain 1 number"),
});

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (creating) return; // If already requested, don't proceed
    setCreating(true);
    await axios
      .post("/api/auth/register", {
        username: values.username,
        password: values.password,
        email: values.email,
      })
      .then((res) => {
        console.log({ user_data: res.data });
        alert("Successfully created user");
      })
      .catch((err) => {
        alert(err);
        console.error(err);
      });
    setCreating(false);
  };

  const [creating, setCreating] = useState(false);

  const { watch, setError, clearErrors } = form;
  const username = watch("username"); // watch on username

  useEffect(() => {
    // Check username avaivability every 1.5 seconds when key pressed
    const delay = setTimeout(async () => {
      if (!checkIfValidUsername(username)) return;

      const avaivable = CheckUsernameAvaivability(username);

      if (!avaivable) {
        setError("username", {
          type: "manual",
          message: "Username already taken",
        });
      } else {
        clearErrors("username");
      }
    }, 1500);

    return () => clearTimeout(delay);
  }, [username, setError, clearErrors]);
  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Yharim24XxxY" {...field} />
                </FormControl>
                <FormDescription>
                  This is your username or in other words your @
                </FormDescription>
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="This is the part where we get your email address"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the part where we get your email address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!creating ? <Button type="submit">Submit</Button> : <p>Creating</p>}
        </form>
      </Form>
    </main>
  );
}
