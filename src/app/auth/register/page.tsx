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
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/context/user-context";
import Link from "next/link";
import { TrippyBackground } from "@/app/components/Common/TrippyBackground";

/**
 * Returns a bool depending on the username avaivability
 * @param username Username to be checked
 * @param accessToken well it's the access token, what else am I supposed to say?
 * @returns Whether the username is already taken or not
 */
const CheckUsernameAvaivability = async (
  username: string,
  accessToken: string
) => {
  const user = await axios
    .get("/api/users/" + username, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
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

  const { accessToken } = useContext(UserContext);

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

      const avaivable = CheckUsernameAvaivability(username, accessToken);

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
  }, [username, setError, clearErrors, accessToken]);
  return (
    <main className="flex items-center justify-center w-screen h-screen bg-cover bg-center text-white bg-[url('/background.login.jpg')]">
        <div className="w-[1024px] h-[540px] bg-black bg-opacity-50 text-white p-4 border border-gray-300 rounded-2xl flex items-center justify-center">
          <div className=" w-[540px] h-[540px] p-10">
          <TrippyBackground></TrippyBackground>
                  <button type="submit" className="w-[50px] h-[2px] border relative left-[180px] "></button>
          </div>
          <div className=" w-[540px] h-[540px] p-10 flex-row content-around items-center justify-center   ">
              <p className="text-4xl">Create an account
      </p>
      <Link href="/auth/login" className="text-gray-300" >Already have account?</Link>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl >                      
                    <Input className="text-gray-200 rounded-xl" placeholder="Enter Username" {...field} />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage className="text-red-600" />
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
                      <Input className="text-gray-200 rounded-xl"  placeholder="Enter your password" type="password" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-600" />
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
                      className="text-gray-200 rounded-xl" 
                        placeholder="Enter your Email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              {!creating ? <Button className="bg-gray-500 text-white w-full rounded-xl" type="submit">Create Account</Button> : <p>...</p>}
            </form>
          </Form>
          </div>
       </div>
    </main>
  );
}