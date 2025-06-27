
"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Loader2 } from "lucide-react";

type Payment = {
  id: string;
  studentName: string;
  amountDue: number;
  dueDate: string;
  status: "Paid" | "Due" | "Overdue";
};


export default function EditPaymentPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const formId = React.useId();
    const paymentId = params.id as string;
    const [isLoading, setIsLoading] = React.useState(true);

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            studentName: "",
            amountDue: 0,
            dueDate: "",
        },
    });

    React.useEffect(() => {
        if (paymentId) {
            try {
                const storedPayments = localStorage.getItem("payments");
                const payments: Payment[] = storedPayments ? JSON.parse(storedPayments) : [];
                const paymentToEdit = payments.find(p => p.id === paymentId);

                if (paymentToEdit) {
                    form.reset({
                        ...paymentToEdit,
                        dueDate: paymentToEdit.dueDate ? new Date(paymentToEdit.dueDate).toISOString().split('T')[0] : ''
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "Payment not found.",
                        variant: "destructive",
                    });
                    router.back();
                }
            } catch (error) {
                console.error("Failed to load payment from localStorage", error);
                router.back();
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, [paymentId, form, router, toast]);

    const handleEditPayment = (data: PaymentFormValues) => {
        try {
            const storedPayments = localStorage.getItem("payments");
            const payments: Payment[] = storedPayments ? JSON.parse(storedPayments) : [];
            
            const updatedPayments = payments.map(p => 
                p.id === paymentId ? { ...p, ...data, id: p.id } : p
            );

            localStorage.setItem("payments", JSON.stringify(updatedPayments));

            toast({
                title: "Payment Updated!",
                description: `Payment for ${data.studentName} has been successfully updated.`,
            });

            router.push("/payments");

        } catch (error) {
            console.error("Failed to save payment to localStorage", error);
            toast({
                title: "Error",
                description: "Failed to update payment. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && router.back()}>
            <DialogContent className="sm:max-w-md h-auto sm:h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Payment</DialogTitle>
                    <DialogDescription>
                        Update the details for this payment record.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow min-h-0">
                   {isLoading ? (
                       <div className="flex items-center justify-center h-full">
                           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                       </div>
                   ) : (
                       <AddPaymentForm form={form} formId={formId} onSubmit={handleEditPayment} />
                   )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" form={formId} disabled={isLoading}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
