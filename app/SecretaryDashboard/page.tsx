"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

import { SecretarySidebar } from "@/components/SecretarySidebar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { UserCheck, User } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SecretaryDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    if (typeof window !== "undefined" && isMounted) {
      fetchStudents();
      fetchTeachers();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  async function fetchStudents() {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students", err);
      toast.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTeachers() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
      toast.error("Failed to load teachers.");
    }
  }

  return (
    <ProtectedRoute allowedRole="secretary">
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <SecretarySidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-700">Secretary Dashboard</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-green-100">
              <CardHeader>
                <CardTitle className="text-green-700">Total Students</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold flex items-center gap-2 text-green-700">
                <UserCheck className="h-6 w-6" /> {students.length}
              </CardContent>
            </Card>
            <Card className="bg-green-100">
              <CardHeader>
                <CardTitle className="text-green-700">Total Teachers</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold flex items-center gap-2 text-green-700">
                <User className="h-6 w-6" /> {teachers.length}
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="students">
            <TabsList className="bg-green-200 mb-4">
              <TabsTrigger value="students" className="text-green-800">
                Students
              </TabsTrigger>
              <TabsTrigger value="teachers" className="text-green-800">
                Teachers
              </TabsTrigger>
            </TabsList>

            {/* Students Tab */}
            <TabsContent value="students">
              <StudentTable students={students} refreshData={fetchStudents} />
            </TabsContent>

            {/* Teachers Tab */}
            <TabsContent value="teachers">
              <TeacherTable teachers={teachers} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface Student {
  id: number;
  full_name: string;
  admission_number: string;
  class_name: string; // Updated from `class_id` to `class_name`
  date_of_admission: string;
}

interface Teacher {
  id: number;
  full_name: string;
  phone_number: string;
  national_id: string;
  address: string;
  specialization: string;
  qualification: string;
  date_of_hire: string;
}

/* STUDENT TABLE */
function StudentTable({ students, refreshData }: { students: Student[]; refreshData?: () => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Admission No.</TableHead>
          <TableHead>Class</TableHead> {/* Updated from "Class ID" to "Class" */}
          <TableHead>Date of Admission</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.length > 0 ? (
          students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.full_name}</TableCell>
              <TableCell>{student.admission_number}</TableCell>
              <TableCell>{student.class_name}</TableCell> {/* Updated from `class_id` to `class_name` */}
              <TableCell>{new Date(student.date_of_admission).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(student.id, refreshData)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No students found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function handleDelete(id: number, refreshData?: () => void) {
  if (!confirm("Are you sure you want to delete?")) return;
  // Handle delete logic here
  refreshData?.();
}

/* TEACHER TABLE */
function TeacherTable({ teachers }: { teachers: Teacher[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>National ID</TableHead>
          <TableHead>Specialization</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.full_name}</TableCell>
              <TableCell>{teacher.phone_number}</TableCell>
              <TableCell>{teacher.national_id}</TableCell>
              <TableCell>{teacher.specialization}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No teachers found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}