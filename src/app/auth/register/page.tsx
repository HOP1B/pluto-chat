// import { Form } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// const FormSchema = z.object({
//   username: z.string(),
//   credential: z.string(),
//   password: z
//     .string()
//     .min(8, "Password's must be atleast 8 characters long")
//     .max(100, "Password's must be shorter than 100 characters")
//     .regex(/\d/, "Password must contain 1 number"),
// });

export default function Page() {
  // const form = useForm<z.infer<typeof FormSchema>>();
  return (
    <main>
      {/* <Form {...form}></Form> */}
    </main>
  );
}
