"use client"

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { date, z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"

const formSchema = z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    student: z.string(),
    date: z.string(),
    status: z.string(),
    staff: z.string(),
    behaviors: z.array(z.object({
      behavior: z.string(),
      count: z.number(),
      timestamps: z.array(z.string())
    }))
  })

const NewSessionForm = ({studentId}) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
        },
      })

      function onSubmit() {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }
  return (
    <div>NewSessionForm</div>
  )
}

export default NewSessionForm