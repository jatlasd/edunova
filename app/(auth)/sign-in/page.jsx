"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "@/lib/GlobalProvider"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const SignIn = () => {
  const router = useRouter();
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState("");

  const clearErrorMessage = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  async function onSubmit(data) {
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        
        setErrorMessage("Invalid login. Please try again.");
        return;
      }

      const result = await response.json();
      console.log("Login successful:", result);
      setUser(result.user);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(result.user)); 
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  }

  return (
    <div className="flex items-center justify-center h-full">
      <section className="flex w-full max-w-[420px] flex-col gap-5 pt-10 md:gap-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center justify-center">
              <Image
                src="/icons/logo.png"
                width={70}
                height={70}
                alt="Horizon Logo"
              />
            <h1 className="ml-5 text-3xl font-bold text-primary">EduNova</h1>
          </div>
          <p className="mt-5 italic font-bold text-20 text-primary-tint">
            Transforming Data Into Progress
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-8"
          >
            {errorMessage && <div className="text-center text-red-500">{errorMessage}</div>}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Email</FormLabel>
                  <div className="flex flex-col w-full">
                    <FormControl>
                      <Input 
                        placeholder="Email" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e); 
                          clearErrorMessage(); 
                        }} 
                      />
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
                  <div className="flex flex-col w-full">
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e); 
                          clearErrorMessage(); 
                        }}
                      />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </div>
                </div>
              )}
            />
            <div className="flex flex-row justify-center">
              <p className=" text-slate-600">
                Don't have an account?&nbsp;
              </p>
              <Link
                href="/sign-up"
                className="font-semibold cursor-pointer text-primary-tint hover:underline"
              >
                Sign Up
              </Link>
            </div>
            <button type="submit" className="form-btn">
              Sign In
            </button>
          </form>
        </Form>
      </section>
    </div>
  );
};

export default SignIn;
