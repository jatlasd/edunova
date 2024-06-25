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
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "@lib/GlobalProvider";
import { useToast } from "@components/ui/use-toast";
import { useState, useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Student name is required",
  }),
  age: z.string(),
  grade: z.string(),
  user: z.string(),
});

const AdminAddStudentDialog = () => {
  const { user } = useGlobalContext();

  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
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

  async function onSubmit(data) {
    try {
      const response = await fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setIsOpen(false);
        toast({
          title: "Student added successfully",
          description: "Refresh to see changes",
        });
      }
      return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
      console.error("Failed to add new student", error);
      return new Response("Failed to add new student", { status: 500 });
    }
  }

  const fetchUsers = async () => {
    const response = await fetch("/api/user");
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="form-btn">Add Student</button>
      </DialogTrigger>
      <DialogContent
        className="bg-white-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="w-1/2 border-b border-b-primary/30 pb-1 text-xl font-bold text-primary-tint">
            Add Student
          </DialogTitle>
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
                  <div className="flex w-full flex-col">
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
                  <div className="flex w-full flex-col">
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
                  <div className="flex w-full flex-col">
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
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Staff</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='text-slate-500 border-primary/30 rounded-lg'>
                        <SelectValue placeholder="Select Staff" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-white-1'>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            ></FormField>
            <button type="submit" className="form-btn">
              Add Student
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAddStudentDialog;
