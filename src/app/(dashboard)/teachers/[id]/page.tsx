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
import { ArrowLeft, Mail, Phone, GraduationCap, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ScheduleData, ClassInfo } from "@/app/(dashboard)/schedule/page";

// Types
type Teacher = {
  id: string;
  name: string;
  subjects: string[];
  contact: string;
  email: string;
};

export default function TeacherProfilePage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;

  const [teacher, setTeacher] = React.useState<Teacher | null>(null);
  const [assignedClasses, setAssignedClasses] = React.useState<ClassInfo[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!teacherId) return;
    try {
      // Fetch teacher data
      const allTeachers: Teacher[] = JSON.parse(localStorage.getItem("teachers") || "[]");
      const targetTeacher = allTeachers.find(t => t.id === teacherId);
      
      if (!targetTeacher) {
        router.push("/teachers"); // Redirect if teacher not found
        return;
      }
      setTeacher(targetTeacher);

      // Fetch assigned classes
      const allSchedules: ScheduleData = JSON.parse(localStorage.getItem("scheduleData") || "{}");
      const teacherClasses: ClassInfo[] = [];
      Object.values(allSchedules).flat().forEach(classInfo => {
        if (classInfo.teacher === targetTeacher.name) {
            teacherClasses.push(classInfo);
        }
      });
      setAssignedClasses(teacherClasses.sort((a,b) => a.time.localeCompare(b.time)));

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, [teacherId, router]);

  if (!isLoaded) {
    return <div className="text-center p-8">Loading teacher profile...</div>;
  }
  
  if (!teacher) {
    return <div className="text-center p-8">Teacher not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/teachers">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Teachers</span>
            </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Profile</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-primary">
                        <AvatarImage src={`https://placehold.co/80x80.png`} data-ai-hint="person" />
                        <AvatarFallback className="text-2xl">{teacher.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{teacher.name}</CardTitle>
                        <CardDescription>Teacher</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span><span className="font-medium">{teacher.contact}</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span><span className="font-medium">{teacher.email}</span></span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5"/>
                        Teaching Subjects
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {teacher.subjects.map(subject => (
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
                        Assigned Classes
                    </CardTitle>
                    <CardDescription>Classes this teacher is assigned to.</CardDescription>
                </CardHeader>
                <CardContent>
                    {assignedClasses.length > 0 ? (
                        <div className="space-y-4">
                            {assignedClasses.map(c => (
                                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div>
                                        <p className="font-bold text-primary">{c.subject}</p>
                                        <p className="text-sm text-muted-foreground">{c.grade}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{c.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center text-muted-foreground py-8">
                            <p>No classes assigned to this teacher.</p>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
