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
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useGlobalContext } from "@lib/GlobalProvider";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStudentContext } from "@lib/StudentProvider";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  student: z.string(),
  createdDate: z.string(),
  status: z.string(),
  staff: z.string(),
  behaviors: z.array(
    z.object({
      behavior: z.string(),
      count: z.number(),
      timestamps: z.array(
        z.object({
          time: z.string(),
          notes: z.string()
        })
      ),
    }),
  ),
});

const CreateSessionDialog = () => {
    const router = useRouter()
  const { user } = useGlobalContext();
  const { student, studentId } = useStudentContext();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      student: studentId,
      createdDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      finishedDate: "",
      status: "Initialized",
      staff: "",
      behaviors: [{ behavior: "", count: 0, timestamps: [{time: "", notes: ""}]}],
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("staff", user.id);
    }
  }, [user]);

  const [behaviors, setBehaviors] = useState([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState([]);

  const fetchBehaviors = async () => {
    // const response = await fetch(`/api/student/${studentId}`);
    // const data = await response.json();
    const initialBehaviors = student.behaviors.map((behavior) => ({
      ...behavior,
      isSelected: false,
    }));
    setBehaviors(student.behaviors);
    setSelectedBehaviors(initialBehaviors);
  };

  useEffect(() => {
    fetchBehaviors();
  }, []);

  const handleCheckboxChange = (behaviorName) => {
    setSelectedBehaviors((prevBehaviors) => {
      const updatedBehaviors = prevBehaviors.map((behavior) =>
        behavior.behavior === behaviorName
          ? { ...behavior, isSelected: !behavior.isSelected }
          : behavior,
      );
      return updatedBehaviors;
    });
  };

  async function onSubmit(data, event) {
    event.preventDefault();
    const selectedData = selectedBehaviors.filter((b) => b.isSelected);

    const updatedData = {
      ...data,
      behaviors: selectedData.map((behavior) => ({
        behavior: behavior.behavior,
        count: 0,
        timestamps: behavior.timestamps && behavior.timestamps.length > 0 ? behavior.timestamps : [],
      })),
    };

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to create session");
      }
      const session = await response.json(); 
      router.push(`/sessions/${session._id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 text-lg font-semibold rounded-md bg-primary text-white-1 hover:bg-primary-tint">
          Create New Session
        </button>
      </DialogTrigger>
      <DialogContent className='bg-white-1' onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl text-primary-tint">
            Create New Session
          </DialogTitle>
        </DialogHeader>
        <div>
          <button onClick={() => console.log(studentId)}>click</button>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FormLabel className="form-label">Session Name</FormLabel>
                    <div className="flex flex-col w-full">
                      <FormControl>
                        <Input
                          placeholder="Session Name"
                          className="input-class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="form-message" />
                    </div>
                  </div>
                )}
              ></FormField>
              {/* Behavior checkboxes */}
              {selectedBehaviors.map((behavior, index) => (
                <div key={index} className="flex justify-between w-1/4">
                  <FormLabel className="form-label">
                    {behavior.behavior}
                  </FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={behavior.isSelected}
                      onChange={() => handleCheckboxChange(behavior.behavior)}
                    />
                  </FormControl>
                </div>
              ))}

              <button type="submit" className="form-btn">
                Create Session
              </button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionDialog;
