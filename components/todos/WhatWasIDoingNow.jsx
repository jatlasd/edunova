"use client";
import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  text: z.string().min(1),
});

const WhatWasIDoingNow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenChange = () => {
    getDoing(), setIsOpen(!isOpen);
  };
  const [currentlyDoing, setCurrentlyDoing] = useState("");
  const [currentlyDoingId, setCurrentlyDoingId] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch(`/api/doing/${currentlyDoingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setShouldUpdate(!shouldUpdate);
        form.reset({ text: "" });
      }
    } catch (error) {
      console.error("Error updating doing:", error);
    }
  };

  const getDoing = async () => {
    try {
      const response = await fetch("/api/doing");
      if (response.ok) {
        const data = await response.json();
        setCurrentlyDoing(data[0].text);
        setCurrentlyDoingId(data[0]._id);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getDoing();
  }, [shouldUpdate]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="btn-primary">WWIDN?</button>
      </DialogTrigger>
      <DialogContent
        className="bg-white-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-primary-tint">
            What Was I Doing?
          </DialogTitle>
          <h1 className="w-full rounded-md border border-primary/10 bg-primary-clear/10 py-5 text-center text-lg font-semibold text-primary">
            {currentlyDoing}
          </h1>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <button type="submit" className="form-btn">
              Submit
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WhatWasIDoingNow;
