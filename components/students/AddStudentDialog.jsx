"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "@lib/GlobalProvider";
import { useToast } from "@components/ui/use-toast";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Student name is required",
  }),
  age: z.string(),
  grade: z.string()
});

const AddStudentDialog = () => {
    const { user } = useGlobalContext();

    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      grade: "",
      user: "",
    },
  });

async function onSubmit(data){
    try {
        const modifiedData = {
            ...data,
            user: [user.id]
        };

        const response = await fetch("/api/student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(modifiedData),
        });
        if(response.ok) {
            setIsOpen(false)
            toast({
                title: "Student added successfully",
                description: "Refresh to see changes"
            })
        }
        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error('Failed to add new student', error);
        return new Response('Failed to add new student', { status: 500 });
    }
}

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="form-btn">Add Student</button>
      </DialogTrigger>
      <DialogContent className="bg-white-1" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='w-1/2 pb-1 text-xl font-bold border-b text-primary-tint border-b-primary/30'>Add Student</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Name</FormLabel>
                  <div className="flex flex-col w-full">
                    <FormControl>
                      <Input
                        placeholder="Enter Name"
                        className="input-class"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </div>
                </div>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Age</FormLabel>
                  <div className="flex flex-col w-full">
                    <FormControl>
                      <Input
                        placeholder="Enter Age"
                        className="input-class"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </div>
                </div>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Grade</FormLabel>
                  <div className="flex flex-col w-full">
                    <FormControl>
                      <Input
                        placeholder="Enter Grade"
                        className="input-class"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </div>
                </div>
              )}
            ></FormField>
            <button type="submit" className="form-btn">Add Student</button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;

