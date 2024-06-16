"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useGlobalContext } from "@lib/GlobalProvider";


const formSchema = z.object({
    firstName: z.string().min(1, {
      message: "First Name is required",
    }),
    lastName: z.string().min(1, {
      message: "Last Name is required",
    }),
    email: z.string().email(),
    password: z.string(),
    role: z.string(),
  });
 

const AddStaff = () => {
    const { user } = useGlobalContext();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          firstName: "",
          lastName: "",
          email: "",
          password: "eagles123",
          role: ""
        },
    })

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
    
          window.location.reload();
        } catch (error) {
          console.error("Signup error:", error);
        }
      }

  return (
    <Popover >
      <PopoverTrigger asChild>
        <button className="rounded-md bg-primary px-4 py-2 font-bold text-white-1 hover:bg-primary-tint">
          Add Staff
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-80 bg-white-1 mt-3'>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({field}) => (
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
                >
                </FormField>
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({field}) => (
                        <div className="flex flex-col gap-1.5">
                        <FormLabel className="form-label">Last Name</FormLabel>
                        <div className="flex w-full flex-col">
                          <FormControl>
                            <Input
                              placeholder="Last Name"
                              className="input-class"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="form-message" />
                        </div>
                      </div>
                    )}
                >
                </FormField>
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <div className="flex flex-col gap-1.5">
                        <FormLabel className="form-label">Email</FormLabel>
                        <div className="flex w-full flex-col">
                          <FormControl>
                            <Input
                              placeholder="Email"
                              className="input-class"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="form-message" />
                        </div>
                      </div>
                    )}
                >
                </FormField>
                    <FormField
                        control={form.control}
                        name="role"
                        render={({field}) => (
                            <div className="flex flex-col">
                                <FormLabel className="form-label">Role</FormLabel>
                                <div className="flex w-full h-10">
                                    <FormControl>
                                        <select
                                            className=" w-full border border-primary px-3 py-2 rounded-lg"
                                            {...field}
                                        >
                                            <option value="user" className="text-16">User</option>
                                            <option value="admin" className="text-16 ">Admin</option>
                                            {user?.role === 'super' && <option value="super" className="text-16">Super</option>}
                                        </select>
                                    </FormControl>
                                </div>
                            </div>
                        )}
                    >

                    </FormField>
                <button type="submit" className="form-btn">
              Add Staff
            </button>
            </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default AddStaff;
