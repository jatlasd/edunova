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
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@lib/utils";
import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useGlobalContext } from "@lib/GlobalProvider";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStudentContext } from "@lib/StudentProvider";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  student: z.string(),
  createdDate: z.string(),
  status: z.string(),
  staff: z.string(),
  scheduledDate: z.date(),
  behaviors: z.array(
    z.object({
      behavior: z.string(),
      count: z.number(),
      timestamps: z.array(
        z.object({
          time: z.string(),
          notes: z.string(),
        }),
      ),
    }),
  ),
});

const CreateSessionDialog = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useGlobalContext();
  const { student, studentId } = useStudentContext();
  const [selectedStudent, setSelectedStudent] = useState(student)
  const [allStudents, setAllStudents] = useState([]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      student: student ? student._id : "",
      createdDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      scheduledDate: format(new Date(), "yyyy-MM-dd"),
      finishedDate: "",
      status: "Initialized",
      staff: "",
      behaviors: [
        { behavior: "", count: 0, timestamps: [{ time: "", notes: "" }] },
      ],
    },
  });

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await fetch(`/api/user/${user.id}`);
        const data = await response.json();
        setAllStudents(data.students);
      } catch (error) {
        consolr.log(error.message);
      }
    };
    if (student) {
      form.setValue("student", student._id);
    }
    if (user) {
      form.setValue("staff", user.id);
      if (pathname === "/sessions") {
        fetchAllStudents();
      }
    }
  }, [user, student]);

  const [behaviors, setBehaviors] = useState([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState([]);

  useEffect(() => {
    if (student) {
      const initialBehaviors = student.behaviors.map((behavior) => ({
        ...behavior,
        isSelected: false,
      }));
      setBehaviors(student.behaviors);
      setSelectedBehaviors(initialBehaviors);
    }
  }, [student]);

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
    console.log("onsubmit called");
    event.preventDefault();
    const selectedData = selectedBehaviors.filter((b) => b.isSelected);

    const updatedData = {
      ...data,
      scheduledDate: format(data.scheduledDate, "yyyy-MM-dd"),
      behaviors: selectedData.map((behavior) => ({
        behavior: behavior.behavior,
        count: 0,
        timestamps:
          behavior.timestamps && behavior.timestamps.length > 0
            ? behavior.timestamps
            : [],
      })),
    };

    console.log(updatedData);

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
      console.log(error.message);
    }
  }

  const showDate = () => {
    const today = new Date();
    console.log(today);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-md bg-primary px-4 py-2 text-lg font-semibold text-white-1 hover:bg-primary-tint">
          Create New Session
        </button>
      </DialogTrigger>
      <DialogContent
        className="bg-white-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <button onClick={() => console.log(allStudents)}>click</button>
          <DialogTitle className="text-xl text-primary-tint">
            Create New Session
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) =>
                console.log(errors),
              )}
              className="flex flex-col space-y-3"
            >
              {pathname === '/sessions' && (
                <FormField
                  control={form.control}
                  name='student'
                  render={({field}) => (
                    <div className="flex flex-col gap-1.5">
                      <FormLabel className='form-label'>Student</FormLabel>
                      <Select onValueChange={field.onChange} defaultVaule={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue  placeholder="Select a student"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='bg-white-1'>
                          {allStudents.map((student) => (
                            <SelectItem key={student._id} value={student._id}>{student.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                >

                </FormField>
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FormLabel className="form-label">Session Name</FormLabel>
                    <div className="flex w-full flex-col">
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
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="form-label">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto bg-white-1 p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              ></FormField>
              {/* Behavior checkboxes */}
              {selectedBehaviors.map((behavior, index) => (
                <div key={index} className="flex w-1/4 justify-between">
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
