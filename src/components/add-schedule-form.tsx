
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const scheduleSchema = z.object({
  day: z.string({ required_error: "Please select a day." }).min(1, "Please select a day."),
  date: z.date().optional(),
  time: z.string().min(1, "Time is required."),
  subject: z.string().min(2, "Subject must be at least 2 characters."),
  grade: z.string().min(1, "Grade is required."),
  teacher: z.string().min(2, "Teacher name must be at least 2 characters."),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;

const defaultValues: Partial<ScheduleFormValues> = {
  day: "",
  time: "",
  subject: "",
  grade: "",
  teacher: "",
  date: undefined,
};

interface AddScheduleFormProps {
  onSubmit: (data: ScheduleFormValues) => void;
  initialData?: ScheduleFormValues;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function AddScheduleForm({ onSubmit, initialData }: AddScheduleFormProps) {
  const { toast } = useToast();
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: initialData || defaultValues,
  });
  const formId = React.useId();
  const { reset, watch, setValue } = form;

  React.useEffect(() => {
    reset(initialData || defaultValues);
  }, [initialData, reset]);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
        if (name === 'date' && value.date) {
            // JS getDay(): Sunday - 0, Monday - 1, ...
            // Our array: Monday - 0, ... Sunday - 6
            const dayIndex = (value.date.getDay() + 6) % 7;
            setValue('day', daysOfWeek[dayIndex], { shouldValidate: true });
        }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue]);


  const handleSubmit = (data: ScheduleFormValues) => {
    onSubmit(data);
    toast({
      title: initialData ? "Schedule Updated!" : "Schedule Added!",
      description: `The class for ${data.subject} has been successfully saved.`,
    });
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>{initialData ? "Edit Class Schedule" : "Add a New Class Schedule"}</SheetTitle>
        <SheetDescription>
          {initialData ? "Update the details for this class." : "Fill in the details below to add a new class to the schedule."}
        </SheetDescription>
      </SheetHeader>
      <ScrollArea className="h-[calc(100%-120px)] pr-6">
        <Form {...form}>
          <form id={formId} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
              <FormItem className="flex flex-col">
                  <FormLabel>Specific Date (Optional)</FormLabel>
                  <Popover>
                  <PopoverTrigger asChild>
                      <FormControl>
                      <Button
                          variant={"outline"}
                          className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                          )}
                      >
                          {field.value ? (
                          format(field.value, "PPP")
                          ) : (
                          <span>Pick a date for a one-time class</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                      </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                      />
                       <div className="p-2 border-t text-center">
                          <Button size="sm" variant="ghost" className="w-full" onClick={() => field.onChange(undefined)}>Clear</Button>
                       </div>
                  </PopoverContent>
                  </Popover>
                  <FormDescription>
                    If set, this class will only appear on this specific date.
                  </FormDescription>
                  <FormMessage />
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of the Week</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={!!form.watch('date')}>
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Math" {...field} />
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
                    <Input placeholder="e.g., Grade 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mr. Smith" {...field} />
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
        <Button type="submit" form={formId}>
          {initialData ? "Save Changes" : "Add Schedule"}
        </Button>
      </SheetFooter>
    </>
  );
}
