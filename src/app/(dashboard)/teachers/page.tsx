"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, FileDown, Pencil, Trash2, User } from "lucide-react";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TeacherForm, type TeacherFormValues } from "@/components/teacher-form";
import { useToast } from "@/hooks/use-toast";

type Teacher = {
  id: string;
  name: string;
  subjects: string[];
  contact: string;
  email: string;
};

const subjectMap: Record<string, string> = {
  math: "Math",
  science: "Science",
  english: "English",
  history: "History",
  art: "Art",
};

export default function TeachersPage() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [editingTeacher, setEditingTeacher] = React.useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = React.useState<Teacher | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const storedTeachers = localStorage.getItem("teachers");
      if (storedTeachers) {
        setTeachers(JSON.parse(storedTeachers));
      }
    } catch (error) {
      console.error("Failed to parse teachers from localStorage", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if(isLoaded) {
      localStorage.setItem("teachers", JSON.stringify(teachers));
    }
  }, [teachers, isLoaded]);

  const handleFormSubmit = (data: TeacherFormValues) => {
     const teacherData = {
      name: data.fullName,
      subjects: data.subjects.map((id) => subjectMap[id] || id),
      contact: data.contactNumber,
      email: data.email,
    };

    if (editingTeacher) {
      const updatedTeacher = { ...editingTeacher, ...teacherData };
      setTeachers(teachers.map(t => t.id === editingTeacher.id ? updatedTeacher : t));
      toast({ title: "Teacher Updated!", description: `${updatedTeacher.name}'s details have been updated.` });
    } else {
      const newTeacher: Teacher = { id: `teacher-${Date.now()}`, ...teacherData };
      setTeachers((prev) => [...prev, newTeacher]);
      toast({ title: "Teacher Added!", description: `${newTeacher.name} has been successfully added.` });
    }

    setEditingTeacher(null);
    setIsSheetOpen(false);
  };
  
  const handleAddNewClick = () => {
    setEditingTeacher(null);
    setIsSheetOpen(true);
  }

  const handleEditClick = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsSheetOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingTeacher) return;
    setTeachers(teachers.filter(t => t.id !== deletingTeacher.id));
    toast({
      title: "Teacher Deleted",
      description: `The record for ${deletingTeacher.name} has been deleted.`,
    });
    setDeletingTeacher(null);
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <>
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
            <p className="text-muted-foreground">
              Manage teacher profiles and information.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/teachers/export" passHref>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </Link>
            <Button onClick={handleAddNewClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registered Teachers</CardTitle>
            <CardDescription>A list of all teachers in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.length > 0 ? teachers.map((teacher) => (
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
                          <DropdownMenuItem onSelect={() => handleEditClick(teacher)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/teachers/${teacher.id}`}>
                              <User className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => setDeletingTeacher(teacher)} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No teachers added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <SheetContent className="sm:max-w-lg">
        <TeacherForm 
          key={editingTeacher ? editingTeacher.id : 'new'}
          onSubmit={handleFormSubmit} 
          initialData={editingTeacher ? {
            fullName: editingTeacher.name,
            subjects: editingTeacher.subjects.map(s => Object.keys(subjectMap).find(key => subjectMap[key] === s) || s).filter(Boolean),
            contactNumber: editingTeacher.contact,
            email: editingTeacher.email
          } : undefined}
        />
      </SheetContent>
    </Sheet>
    <AlertDialog open={!!deletingTeacher} onOpenChange={() => setDeletingTeacher(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the teacher record for {deletingTeacher?.name}.
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
    </>
  );
}
