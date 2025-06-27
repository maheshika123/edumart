
"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Student } from "@/app/(dashboard)/students/page";
import type { ClassInfo, ScheduleData } from "@/app/(dashboard)/schedule/page";

type AttendanceStatus = "Present" | "Absent";
type AttendanceData = Record<string, Record<string, Record<string, AttendanceStatus>>>;

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [students, setStudents] = React.useState<Student[]>([]);
  const [schedule, setSchedule] = React.useState<ScheduleData>({});
  const [attendanceData, setAttendanceData] = React.useState<AttendanceData>({});
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedStudents = localStorage.getItem("students");
      const storedSchedule = localStorage.getItem("scheduleData");
      const storedAttendance = localStorage.getItem("attendanceData");

      if (storedStudents) setStudents(JSON.parse(storedStudents));
      if (storedSchedule) setSchedule(JSON.parse(storedSchedule));
      if (storedAttendance) setAttendanceData(JSON.parse(storedAttendance));
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
    }
  }, [attendanceData, isLoaded]);

  const handleAttendanceChange = (
    classId: string,
    studentId: string,
    status: AttendanceStatus
  ) => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    setAttendanceData((prev) => {
        const newData = { ...prev };
        if (!newData[dateKey]) newData[dateKey] = {};
        if (!newData[dateKey][classId]) newData[dateKey][classId] = {};
        newData[dateKey][classId][studentId] = status;
        return newData;
    });
  };

  const getEnrolledStudents = (classSubject: string): Student[] => {
    return students.filter((student) =>
      student.subjects.includes(classSubject)
    );
  };
  
  const selectedDayName = daysOfWeek[selectedDate.getDay()];
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const classesOnDayOfWeek = schedule[selectedDayName] || [];

  const classesForSelectedDay = classesOnDayOfWeek
    .filter((classInfo) => {
      // Show recurring classes (no date) or classes matching the specific date
      return !classInfo.date || classInfo.date === dateKey;
    })
    .sort((a, b) => a.time.localeCompare(b.time));


  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking</h1>
          <p className="text-muted-foreground">
            Mark student attendance for the selected date.
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-6">
        {classesForSelectedDay.length > 0 ? (
          classesForSelectedDay.map((classInfo) => {
            const enrolledStudents = getEnrolledStudents(classInfo.subject);
            return (
              <Card key={classInfo.id}>
                <CardHeader>
                  <CardTitle>{classInfo.subject} - {classInfo.grade}</CardTitle>
                  <CardDescription>
                    {classInfo.time} with {classInfo.teacher}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrolledStudents.length > 0 ? (
                      enrolledStudents.map((student) => {
                        const currentStatus = attendanceData[dateKey]?.[classInfo.id]?.[student.id];
                        return (
                          <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <p className="font-medium">{student.name}</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={currentStatus === 'Present' ? 'default' : 'outline'}
                                onClick={() => handleAttendanceChange(classInfo.id, student.id, 'Present')}
                                className="bg-green-500 hover:bg-green-600 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-green-600 border-green-500"
                              >
                                Present
                              </Button>
                              <Button
                                size="sm"
                                variant={currentStatus === 'Absent' ? 'destructive' : 'outline'}
                                onClick={() => handleAttendanceChange(classInfo.id, student.id, 'Absent')}
                              >
                                Absent
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No students are enrolled in this subject.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
                <p>No classes scheduled for {format(selectedDate, "PPP")}.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
