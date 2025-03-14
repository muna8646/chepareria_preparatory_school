"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

import { SecretarySidebar } from "@/components/SecretarySidebar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { UserCheck, User, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SecretaryDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    if (typeof window !== "undefined" && isMounted) {
      fetchStudents();
      fetchTeachers();
      fetchFees();
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

  async function fetchFees() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/fees", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setFees(data);
    } catch (err) {
      console.error("Failed to fetch fees", err);
      toast.error("Failed to load fees.");
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            <Card className="bg-green-100">
              <CardHeader>
                <CardTitle className="text-green-700">Total Fees Collected</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold flex items-center gap-2 text-green-700">
                <DollarSign className="h-6 w-6" /> {fees.length}
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
              <TabsTrigger value="fees" className="text-green-800">
                Fee Payment
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

            {/* Fees Tab */}
            <TabsContent value="fees">
              <FeeTable fees={fees} />
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
  class: string;
  date_of_admission: string;
  role: string;
}

interface Teacher {
  id: number;
  full_name: string;
  tsc_number: string;
  subject: string;
  class_assigned: string;
}

interface Fee {
  id: number;
  student_name: string;
  admission_number: string;
  amount: number;
  date_paid: string;
}

/* STUDENT TABLE */
function StudentTable({ students, refreshData }: { students: Student[]; refreshData?: () => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Admission No.</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Date of Admission</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.length > 0 ? (
          students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.full_name}</TableCell>
              <TableCell>{student.admission_number}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{new Date(student.date_of_admission).toLocaleDateString()}</TableCell>
              <TableCell>{student.role}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(student.id, refreshData)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
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
          <TableHead>TSC Number</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Class Assigned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.full_name}</TableCell>
              <TableCell>{teacher.tsc_number}</TableCell>
              <TableCell>{teacher.subject}</TableCell>
              <TableCell>{teacher.class_assigned}</TableCell>
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

/* FEE TABLE */
function FeeTable({ fees }: { fees: Fee[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student Name</TableHead>
          <TableHead>Admission No.</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date Paid</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fees.length > 0 ? (
          fees.map((fee) => (
            <TableRow key={fee.id}>
              <TableCell>{fee.student_name}</TableCell>
              <TableCell>{fee.admission_number}</TableCell>
              <TableCell>Ksh {fee.amount}</TableCell>
              <TableCell>{new Date(fee.date_paid).toLocaleDateString()}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No fee records found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
