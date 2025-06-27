
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
import { PlusCircle, MoreHorizontal, FileDown, Pencil, Trash2, Users } from "lucide-react";
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
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { StudentRegistrationForm, type StudentFormValues } from "@/components/student-registration-form";
import { useToast } from "@/hooks/use-toast";

type Student = {
  id: string;
  name: string;
  grade: string;
  subjects: string[];
  contact: string;
  parentName: string;
  email: string;
};

const subjectMap: Record<string, string> = {
  math: "Math",
  science: "Science",
  english: "English",
  history: "History",
  art: "Art",
};

export default function StudentsPage() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = React.useState<Student | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const storedStudents = localStorage.getItem("students");
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }
    } catch (error) {
      console.error("Failed to parse students from localStorage", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if(isLoaded) {
      localStorage.setItem("students", JSON.stringify(students));
    }
  }, [students, isLoaded]);

  const handleFormSubmit = (data: StudentFormValues) => {
     const studentData = {
      name: data.fullName,
      grade: data.grade,
      subjects: data.subjects.map((id) => subjectMap[id] || id),
      contact: data.contactNumber,
      parentName: data.parentName,
      email: data.email,
    };

    if (editingStudent) {
      const updatedStudent = { ...editingStudent, ...studentData };
      setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s));
      toast({ title: "Student Updated!", description: `${updatedStudent.name}'s details have been updated.` });
    } else {
      const newStudent: Student = { id: `student-${Date.now()}`, ...studentData };
      setStudents((prev) => [...prev, newStudent]);
      toast({ title: "Student Registered!", description: `${newStudent.name} has been successfully registered.` });
    }

    setEditingStudent(null);
    setIsSheetOpen(false);
  };
  
  const handleAddNewClick = () => {
    setEditingStudent(null);
    setIsSheetOpen(true);
  }

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setIsSheetOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingStudent) return;
    setStudents(students.filter(s => s.id !== deletingStudent.id));
    toast({
      title: "Student Deleted",
      description: `The record for ${deletingStudent.name} has been deleted.`,
    });
    setDeletingStudent(null);
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
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">
              Manage student profiles and registration.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/students/export" passHref>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </Link>
            <Button onClick={handleAddNewClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Register Student
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registered Students</CardTitle>
            <CardDescription>A list of all students currently enrolled.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length > 0 ? students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {student.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary">{subject}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{student.contact}</TableCell>
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
                          <DropdownMenuItem onSelect={() => handleEditClick(student)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/students/${student.id}`}>
                              <Users className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => setDeletingStudent(student)} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
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
                      No students registered yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <SheetContent className="sm:max-w-lg">
        <StudentRegistrationForm 
          key={editingStudent ? editingStudent.id : 'new'}
          onSubmit={handleFormSubmit} 
          initialData={editingStudent ? {
            fullName: editingStudent.name,
            grade: editingStudent.grade,
            subjects: editingStudent.subjects.map(s => Object.keys(subjectMap).find(key => subjectMap[key] === s) || s).filter(Boolean),
            parentName: editingStudent.parentName,
            contactNumber: editingStudent.contact,
            email: editingStudent.email
          } : undefined}
        />
      </SheetContent>
    </Sheet>
    <AlertDialog open={!!deletingStudent} onOpenChange={() => setDeletingStudent(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the student record for {deletingStudent?.name}.
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

    