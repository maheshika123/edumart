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

type Teacher = {
  id: string;
  name: string;
  subjects: string[];
  contact: string;
  email: string;
};

// Extend jsPDF with autoTable for TypeScript
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export default function ExportTeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    try {
      const storedTeachers = localStorage.getItem("teachers");
      if (storedTeachers) {
        setTeachers(JSON.parse(storedTeachers));
      }
    } catch (error) {
      console.error("Failed to parse teachers from localStorage", error);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    doc.text("Teacher List", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [["Name", "Subjects", "Contact", "Email"]],
      body: teachers.map(teacher => [
        teacher.name,
        teacher.subjects.join(", "),
        teacher.contact,
        teacher.email
      ]),
    });
    doc.save("teachers.pdf");
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
            <h1 className="text-3xl font-bold tracking-tight">Export Teacher Data</h1>
            <p className="text-muted-foreground">
              Preview of the teacher data to be exported.
            </p>
          </div>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {teacher.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary">{subject}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{teacher.contact}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No teacher data to export.
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
              Choose how you would like to export the teacher data.
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
