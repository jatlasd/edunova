"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "@lib/GlobalProvider";
import { useToast } from "@components/ui/use-toast";
import { useState } from "react";

const formSchema = z.object({
  item: z.string().min(1),
  description: z.string().min(1),
  path: z.optional(z.string()),
  notes: z.optional(z.string()),
});

const AddTodoDialog = ({ type }) => {
  const {toast} = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useGlobalContext();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item: "",
      type: "",
      description: "",
      status: "",
      user: {},
      path: "",
      notes: "",
    },
  });

  const onSubmit = async (data, event) => {
    console.log("onsubmit called");
    event.preventDefault();
    const updatedData = {
      ...data,
      type: type === "bug" ? "Bug" : "Todo",
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      status: "Open",
    };

    try {
      const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to add todo");
      }
      if (response.ok) {
        console.log("Todo added successfully");
        toast({
          title: "Added successfully"
        })
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="btn-primary">
          Add {type === "bug" ? "Bug" : "Todo"}
        </button>
      </DialogTrigger>
      <DialogContent
        className="bg-white-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className='text-primary font-semibold text-lg'>Add New {type === "bug" ? "Bug" : "Todo"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors),
            )}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="item"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">
                    {type === "bug" ? "Bug" : "Todo"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${type === "bug" ? "Bug" : "Todo"}`}
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Description"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            ></FormField>
            {type === "bug" && (
              <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FormLabel className="form-label">Path</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter path to get to current page"
                        className="input-class"
                        {...field}
                      />
                    </FormControl>
                  </div>
                )}
              ></FormField>
            )}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Notes</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Any additional notes?"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                </div>
              )}
            ></FormField>
            <button type="submit" className="btn-primary">
              Add Todo
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoDialog;
