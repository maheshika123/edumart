
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreVertical, Trash2, Pencil, Calendar as CalendarIcon } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { AddScheduleForm, type ScheduleFormValues } from "@/components/add-schedule-form";
import { format, parse } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export type ClassInfo = {
  id: string;
  time: string;
  subject: string;
  grade: string;
  teacher: string;
  date?: string;
};

export type ScheduleData = {
  [key: string]: ClassInfo[];
};

const initialScheduleData: ScheduleData = {
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SchedulePage() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [scheduleData, setScheduleData] = React.useState<ScheduleData>(initialScheduleData);
  const [editingSchedule, setEditingSchedule] = React.useState<{ day: string, classInfo: ClassInfo } | null>(null);
  const [deletingSchedule, setDeletingSchedule] = React.useState<{ day: string, classId: string } | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedSchedule = localStorage.getItem("scheduleData");
      if (storedSchedule) {
        const parsedData = JSON.parse(storedSchedule);
        const fullData = { ...initialScheduleData, ...parsedData };
        setScheduleData(fullData);
      }
    } catch (error) {
      console.error("Failed to parse schedule from localStorage", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("scheduleData", JSON.stringify(scheduleData));
    }
  }, [scheduleData, isLoaded]);

  const handleFormSubmit = (data: ScheduleFormValues) => {
    setScheduleData((prev) => {
      const updatedSchedule = { ...prev };
      const classId = editingSchedule ? editingSchedule.classInfo.id : Date.now().toString();
      
      const newClassInfo: ClassInfo = { 
          id: classId,
          time: data.time,
          subject: data.subject,
          grade: data.grade,
          teacher: data.teacher,
          date: data.date ? format(data.date, "yyyy-MM-dd") : undefined
      };

      // If editing, remove the old entry first from its original day
      if (editingSchedule) {
        const { day: oldDay } = editingSchedule;
        updatedSchedule[oldDay] = (updatedSchedule[oldDay] || []).filter(c => c.id !== classId);
        // Clean up old day if it becomes empty and day has changed
        if (oldDay !== data.day && updatedSchedule[oldDay]?.length === 0) {
            delete updatedSchedule[oldDay];
        }
      }
      
      const targetDay = data.day;
      const daySchedule = [...(updatedSchedule[targetDay] || []), newClassInfo];
      daySchedule.sort((a, b) => a.time.localeCompare(b.time));
      updatedSchedule[targetDay] = daySchedule;

      return updatedSchedule;
    });

    setEditingSchedule(null);
    setIsSheetOpen(false);
  };


  const handleEditClick = (day: string, classInfo: ClassInfo) => {
    setEditingSchedule({ day, classInfo });
    setIsSheetOpen(true);
  };
  
  const handleAddNewClick = () => {
    setEditingSchedule(null);
    setIsSheetOpen(true);
  }

  const handleDeleteConfirm = () => {
    if (deletingSchedule) {
      const { day, classId } = deletingSchedule;
      setScheduleData(prev => {
        const updatedSchedule = { ...prev };
        updatedSchedule[day] = (updatedSchedule[day] || []).filter(c => c.id !== classId);
        if (updatedSchedule[day]?.length === 0) {
          delete updatedSchedule[day];
        }
        return updatedSchedule;
      });
      setDeletingSchedule(null);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) {
          setEditingSchedule(null);
        }
    }}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
            <p className="text-muted-foreground">
              Here is the class schedule for the upcoming week.
            </p>
          </div>
          <Button onClick={handleAddNewClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Class Schedule
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {daysOfWeek.map((day) => (
            <Card key={day} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {scheduleData[day] && scheduleData[day].length > 0 ? (
                  <div className="space-y-4">
                    {scheduleData[day].map((classInfo) => (
                      <div key={classInfo.id} className="relative p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div className="absolute top-1 right-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditClick(day, classInfo)} className="cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDeletingSchedule({ day, classId: classInfo.id })} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="font-semibold text-sm flex items-center gap-1.5">
                          {classInfo.time}
                          {classInfo.date && (
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>One-time class on {format(parse(classInfo.date, 'yyyy-MM-dd', new Date()), "PPP")}</p>
                                    </TooltipContent>
                                </Tooltip>
                             </TooltipProvider>
                          )}
                        </p>
                        <p className="text-base font-medium text-primary">{classInfo.subject}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                          <span>{classInfo.grade}</span>
                          <span>{classInfo.teacher}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    <p>No classes scheduled.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
       <SheetContent className="sm:max-w-md">
        <AddScheduleForm
          key={editingSchedule ? editingSchedule.classInfo.id : 'new'}
          onSubmit={handleFormSubmit}
          initialData={editingSchedule ? { 
              day: editingSchedule.day, 
              ...editingSchedule.classInfo,
              date: editingSchedule.classInfo.date ? parse(editingSchedule.classInfo.date, 'yyyy-MM-dd', new Date()) : undefined
            } : undefined}
        />
      </SheetContent>

      <AlertDialog open={!!deletingSchedule} onOpenChange={() => setDeletingSchedule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
