
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, FileDown, Pencil, Trash2, BellRing } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type Payment = {
  id: string;
  studentName: string;
  amountDue: number;
  dueDate: string;
  status: "Paid" | "Due" | "Overdue";
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Paid":
            return "default";
        case "Due":
            return "secondary";
        case "Overdue":
            return "destructive";
        default:
            return "outline";
    }
}

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [paymentToDelete, setPaymentToDelete] = React.useState<Payment | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const storedPayments = localStorage.getItem("payments");
      if (storedPayments) {
        setPayments(JSON.parse(storedPayments));
      }
    } catch (error) {
      console.error("Failed to parse payments from localStorage", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);
  
  React.useEffect(() => {
    if (isLoaded) {
        localStorage.setItem("payments", JSON.stringify(payments));
    }
  }, [payments, isLoaded]);

  const handleDeletePayment = () => {
    if (!paymentToDelete) return;

    try {
        const updatedPayments = payments.filter(p => p.id !== paymentToDelete.id);
        setPayments(updatedPayments);
        localStorage.setItem("payments", JSON.stringify(updatedPayments));
        toast({
            title: "Payment Deleted",
            description: `The payment for ${paymentToDelete.studentName} has been deleted.`,
        });
    } catch (error) {
        console.error("Failed to delete payment from localStorage", error);
        toast({
            title: "Error",
            description: "Failed to delete payment. Please try again.",
            variant: "destructive",
        });
    }
    setPaymentToDelete(null);
  };
  
  const handleSendReminder = (payment: Payment) => {
    toast({
      title: "Reminder Sent",
      description: `A payment reminder has been sent to ${payment.studentName}.`,
    });
  };


  if (!isLoaded) {
    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                    <p className="text-muted-foreground">
                        Track and manage student payments and due dates.
                    </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>A record of all student payment statuses.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead className="text-right">Amount Due</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Loading payment records...
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <>
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Track and manage student payments and due dates.
          </p>
        </div>
        <div className="flex gap-2">
            <Link href="/payments/export" passHref>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </Link>
            <Link href="/payments/add" passHref>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Payment
                </Button>
            </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>A record of all student payment statuses.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Amount Due</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payments.length > 0 ? (
                    payments.map((payment) => (
                    <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.studentName}</TableCell>
                        <TableCell className="text-right">${payment.amountDue.toFixed(2)}</TableCell>
                        <TableCell>{payment.dueDate}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(payment.status) as any}>{payment.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/payments/edit/${payment.id}`} className="flex items-center cursor-pointer">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                 {(payment.status === 'Due' || payment.status === 'Overdue') && (
                                    <DropdownMenuItem onClick={() => handleSendReminder(payment)} className="flex items-center cursor-pointer">
                                        <BellRing className="mr-2 h-4 w-4" />
                                        Send Reminder
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setPaymentToDelete(payment)} className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center cursor-pointer">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No payment records found. Add one to get started.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
    <AlertDialog open={!!paymentToDelete} onOpenChange={() => setPaymentToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the payment record for {paymentToDelete?.studentName}.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePayment} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
