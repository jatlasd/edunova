"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First Name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  role: z.string(),
});

const SignUp = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: 'user',
    },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      const result = await response.json();
      console.log("Signup successful:", result);
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  return (
    <div className="bg-gradient flex h-full w-full items-center justify-center">
      <section className="flex  w-full max-w-[420px] flex-col justify-center gap-5 py-10 md:gap-8">
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <Image
              src="/icons/logo.png"
              width={70}
              height={70}
              alt="Horizon Logo"
            />
            <h1 className="ml-5 text-3xl font-bold text-primary">EduNova</h1>
          </div>
          <p className="text-20 mt-5 font-bold italic text-primary-tint">
            Transforming Data Into Progress
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-8"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">First Name</FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        className="input-class"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Last Name</FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Email</FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Password</FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </div>
                </div>
              )}
            />

            <div className="flex flex-row justify-center">
              <p className=" text-slate-600">
                Already have an account?&nbsp;
              </p>
              <Link
                href="/sign-in"
                className="cursor-pointer font-semibold text-primary-tint hover:underline"
              >
                Sign In
              </Link>
            </div>

            <button type="submit" className="form-btn">
              Sign Up
            </button>
          </form>
        </Form>
      </section>
    </div>
  );
};

export default SignUp;
