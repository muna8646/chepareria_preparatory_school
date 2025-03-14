"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TeacherSidebar } from "@/components/TeacherSidebar";

export default function TeacherData() {
  const [students, setStudents] = useState<{ id: number; name: string; class_name: string }[]>([]);
  const [attendance, setAttendance] = useState<{ id: number; date: string; student_name: string; status: string }[]>([]);
  const [grades, setGrades] = useState<{ id: number; student_name: string; subject: string; grade: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/teacher/students", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);

    fetch("http://localhost:5000/teacher/attendance", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setAttendance)
      .catch(console.error);

    fetch("http://localhost:5000/teacher/grades", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then(setGrades)
      .catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Teacher Panel</h1>
        <Tabs defaultValue="students">
          <TabsList className="mb-4">
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.class_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="attendance">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.student_name}</TableCell>
                    <TableCell>{record.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="grades">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>{grade.student_name}</TableCell>
                    <TableCell>{grade.subject}</TableCell>
                    <TableCell>{grade.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
