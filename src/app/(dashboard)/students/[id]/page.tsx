
"use client";

import * as React from "react";
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Phone, GraduationCap, BookOpen, Banknote, CalendarDays, UserSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ScheduleData, ClassInfo } from "@/app/(dashboard)/schedule/page";

// Types (could be moved to a central types file)
type Student = {
  id: string;
  name: string;
  grade: string;
  subjects: string[];
  contact: string;
  parentName: string;
  email: string;
};

type Payment = {
  id:string;
  studentName: string;
  amountDue: number;
  dueDate: string;
  status: "Paid" | "Due" | "Overdue";
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

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = React.useState<Student | null>(null);
  const [enrolledClasses, setEnrolledClasses] = React.useState<ClassInfo[]>([]);
  const [paymentHistory, setPaymentHistory] = React.useState<Payment[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!studentId) return;
    try {
      // Fetch student data
      const allStudents: Student[] = JSON.parse(localStorage.getItem("students") || "[]");
      const targetStudent = allStudents.find(s => s.id === studentId);
      
      if (!targetStudent) {
        router.push("/students"); // Redirect if student not found
        return;
      }
      setStudent(targetStudent);

      // Fetch enrolled classes (by subject match)
      const allSchedules: ScheduleData = JSON.parse(localStorage.getItem("scheduleData") || "{}");
      const studentClasses: ClassInfo[] = [];
      Object.values(allSchedules).flat().forEach(classInfo => {
        if (targetStudent.subjects.includes(classInfo.subject)) {
            studentClasses.push(classInfo);
        }
      });
      setEnrolledClasses(studentClasses.sort((a,b) => a.time.localeCompare(b.time)));

      // Fetch payment history (by name match)
      const allPayments: Payment[] = JSON.parse(localStorage.getItem("payments") || "[]");
      const studentPayments = allPayments.filter(p => p.studentName === targetStudent.name);
      setPaymentHistory(studentPayments);

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, [studentId, router]);

  if (!isLoaded) {
    return <div className="text-center p-8">Loading student profile...</div>;
  }
  
  if (!student) {
    return <div className="text-center p-8">Student not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/students">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Students</span>
            </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-primary">
                        <AvatarImage src={`https://placehold.co/80x80.png`} data-ai-hint="person" />
                        <AvatarFallback className="text-2xl">{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{student.name}</CardTitle>
                        <CardDescription>{student.grade}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <UserSquare className="h-5 w-5 text-muted-foreground" />
                        <span>Parent: <span className="font-medium">{student.parentName}</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span><span className="font-medium">{student.contact}</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span><span className="font-medium">{student.email}</span></span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5"/>
                        Enrolled Subjects
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {student.subjects.map(subject => (
                        <Badge key={subject} variant="secondary" className="text-base py-1 px-3">{subject}</Badge>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5"/>
                        Class Schedule
                    </CardTitle>
                    <CardDescription>Classes the student is enrolled in.</CardDescription>
                </CardHeader>
                <CardContent>
                    {enrolledClasses.length > 0 ? (
                        <div className="space-y-4">
                            {enrolledClasses.map(c => (
                                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div>
                                        <p className="font-bold text-primary">{c.subject}</p>
                                        <p className="text-sm text-muted-foreground">{c.grade} - Taught by {c.teacher}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{c.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center text-muted-foreground py-8">
                            <p>No classes found for the enrolled subjects.</p>
                         </div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Banknote className="h-5 w-5"/>
                        Payment History
                    </CardTitle>
                     <CardDescription>Payment records for this student.</CardDescription>
                </CardHeader>
                <CardContent>
                    {paymentHistory.length > 0 ? (
                        <div className="space-y-2">
                            {paymentHistory.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div>
                                        <p className="font-medium">Due: <span className="font-mono">${p.amountDue.toFixed(2)}</span></p>
                                        <p className="text-sm text-muted-foreground">Due Date: {p.dueDate}</p>
                                    </div>
                                    <Badge variant={getStatusVariant(p.status) as any}>{p.status}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center text-muted-foreground py-8">
                            <p>No payment records found for this student.</p>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
