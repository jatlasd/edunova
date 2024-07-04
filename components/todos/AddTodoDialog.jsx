"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "@lib/GlobalProvider";

import { useState, useEffect } from "react";

const formSchema = z.object({
  bug: z.string().min(1),
  description: z.string().min(1),
  path: z.string().min(1),
  notes: z.optional(z.string()),
});

const AddTodoDialog = () => {
  const { user } = useGlobalContext();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bug: "",
      description: "",
      status: "Open",
      user: {},
      path: "",
      notes: "",
    },
  });

  const onSubmit = () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn-primary">Add Todo</button>
      </DialogTrigger>
      <DialogContent
        className="bg-white-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
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
              name="bug"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FormLabel className="form-label">Bug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Bug"
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
