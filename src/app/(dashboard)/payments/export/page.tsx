"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Printer, FileDown } from "lucide-react";

type Payment = {
  id: string;
  studentName: string;
  amountDue: number;
  dueDate: string;
  status: "Paid" | "Due" | "Overdue";
};

// Extend jsPDF with autoTable for TypeScript
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

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

export default function ExportPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    try {
      const storedPayments = localStorage.getItem("payments");
      if (storedPayments) {
        setPayments(JSON.parse(storedPayments));
      }
    } catch (error) {
      console.error("Failed to parse payments from localStorage", error);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    doc.text("Payment List", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [["Student", "Amount Due", "Due Date", "Status"]],
      body: payments.map(payment => [
        payment.studentName,
        `$${payment.amountDue.toFixed(2)}`,
        payment.dueDate,
        payment.status
      ]),
    });
    doc.save("payments.pdf");
  };

  if (!isClient) {
    // Render nothing on the server to avoid hydration errors
    return null;
  }

  return (
    <>
      <div className="printable-area space-y-8">
        <div className="flex items-center justify-between print-hidden">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Export Payment Data</h1>
            <p className="text-muted-foreground">
              Preview of the payment data to be exported.
            </p>
          </div>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Amount Due</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No payment data to export.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={true} onOpenChange={(open) => !open && router.back()}>
        <DialogContent className="sm:max-w-md print-hidden">
          <DialogHeader>
            <DialogTitle>Export Options</DialogTitle>
            <DialogDescription>
              Choose how you would like to export the payment data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <Button onClick={handleExportPdf}>
              <FileDown className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
          <DialogFooter>
             <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <style jsx global>{`
        @media print {
          body {
            background: none;
          }
          .print-hidden {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 20px;
          }
           .printable-area .bg-card {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
}
