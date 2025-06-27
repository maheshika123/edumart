"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AddPaymentForm, paymentSchema, type PaymentFormValues } from "@/components/add-payment-form";

type Payment = {
  id: string;
  studentName: string;
  amountDue: number;
  dueDate: string;
  status: "Paid" | "Due" | "Overdue";
};


export default function AddPaymentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const formId = React.useId();
    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            studentName: "",
            amountDue: 0,
            dueDate: "",
            status: undefined,
        },
    });

    const handleAddPayment = (data: PaymentFormValues) => {
        try {
            const storedPayments = localStorage.getItem("payments");
            const payments: Payment[] = storedPayments ? JSON.parse(storedPayments) : [];

            const newPayment: Payment = {
                id: `payment-${Date.now()}`,
                ...data,
            };

            const updatedPayments = [...payments, newPayment];
            localStorage.setItem("payments", JSON.stringify(updatedPayments));

            toast({
                title: "Payment Added!",
                description: `Payment for ${data.studentName} has been successfully recorded.`,
            });

            router.push("/payments");

        } catch (error) {
            console.error("Failed to save payment to localStorage", error);
            toast({
                title: "Error",
                description: "Failed to save payment. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && router.back()}>
            <DialogContent className="sm:max-w-md h-auto sm:h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Add New Payment</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to record a new payment.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow min-h-0">
                   <AddPaymentForm form={form} formId={formId} onSubmit={handleAddPayment} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" form={formId}>Add Payment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
