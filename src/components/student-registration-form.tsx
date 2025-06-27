
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";

const subjects = [
  { id: "math", label: "Math" },
  { id: "science", label: "Science" },
  { id: "english", label: "English" },
  { id: "history", label: "History" },
  { id: "art", label: "Art" },
];

const studentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  grade: z.string().min(1, "Grade is required."),
  subjects: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one subject.",
  }),
  parentName: z.string().min(2, "Parent/Guardian name must be at least 2 characters."),
  contactNumber: z.string().regex(/^\d{10,15}$/, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentRegistrationFormProps {
    onSubmit: (data: StudentFormValues) => void;
    initialData?: StudentFormValues;
}

const defaultValues: StudentFormValues = {
    fullName: "",
    grade: "",
    subjects: [],
    parentName: "",
    contactNumber: "",
    email: "",
};

export function StudentRegistrationForm({ onSubmit, initialData }: StudentRegistrationFormProps) {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || defaultValues,
  });
  
  const { reset } = form;

  React.useEffect(() => {
    reset(initialData || defaultValues);
  }, [initialData, reset]);

  return (
    <>
      <SheetHeader>
        <SheetTitle>{initialData ? "Edit Student Details" : "Register a New Student"}</SheetTitle>
        <SheetDescription>
          {initialData ? "Update the student's information below." : "Fill in the details below to add a new student to the system."}
        </SheetDescription>
      </SheetHeader>
      <ScrollArea className="h-[calc(100%-120px)] pr-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10th Grade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subjects"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Subjects</FormLabel>
                    <FormDescription>
                      Select the subjects the student is enrolling in.
                    </FormDescription>
                  </div>
                  {subjects.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="subjects"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="parent@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </ScrollArea>
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline" type="button">Cancel</Button>
        </SheetClose>
        <Button onClick={form.handleSubmit(onSubmit)} type="submit">{initialData ? "Save Changes" : "Register Student"}</Button>
      </SheetFooter>
    </>
  );
}
