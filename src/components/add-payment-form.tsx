"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
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
import { ScrollArea } from "./ui/scroll-area";
import React from "react";


export const paymentSchema = z.object({
  studentName: z.string().min(2, "Student name must be at least 2 characters."),
  amountDue: z.coerce.number().positive("Amount must be a positive number."),
  dueDate: z.string().min(1, "Due date is required."),
  status: z.enum(["Paid", "Due", "Overdue"], {
    required_error: "Please select a payment status.",
  }),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

interface AddPaymentFormProps {
  form: UseFormReturn<PaymentFormValues>;
  formId: string;
  onSubmit: (data: PaymentFormValues) => void;
}

export function AddPaymentForm({ form, formId, onSubmit }: AddPaymentFormProps) {
  return (
    <ScrollArea className="h-full pr-6">
      <Form {...form}>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amountDue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Due</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 150" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Due">Due</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ScrollArea>
  );
}
