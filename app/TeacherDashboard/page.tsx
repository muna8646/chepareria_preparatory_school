"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TeacherSidebar as Sidebar } from "@/components/TeacherSidebar";
import { Users, BookOpen, Bell } from "lucide-react";


// Type Definitions
interface Class {
  id: number;
  name: string;
  student_count: number;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
}

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [announcements, setAnnouncements] = useState([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchClasses();
    fetchAnnouncements();
    fetchTeacherProfile();
  }, []);

  async function fetchClasses() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/teacher-classes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch classes");

      const data = await res.json();
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes", err);
    }
  }

  async function fetchAnnouncements() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/teacher-announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch announcements");

      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements", err);
    }
  }

  async function fetchTeacherProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/teacher-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        console.error("Failed to fetch teacher profile:", errorMessage);
        return;
      }

      const data = await res.json();
      console.log("Teacher profile data:", data);
      setTeacher(data);
    } catch (err) {
      console.error("Error fetching teacher profile", err);
    }
  }

  return (
    <ProtectedRoute allowedRole="teacher">
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>

            {teacher && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white text-lg font-bold rounded-full">
                  {teacher.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </div>
                <span className="text-lg font-semibold">{teacher.name}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader><CardTitle>Your Classes</CardTitle></CardHeader>
              <CardContent className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" /> {classes.length}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Students</CardTitle></CardHeader>
              <CardContent className="text-xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                {classes.reduce((sum, cls) => sum + cls.student_count, 0)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Announcements</CardTitle></CardHeader>
              <CardContent className="text-xl font-bold flex items-center gap-2">
                <Bell className="h-6 w-6 text-yellow-500" /> {announcements.length}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
