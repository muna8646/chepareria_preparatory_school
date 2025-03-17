"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SecretarySidebar } from "@/components/SecretarySidebar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AssignTeacherClassPage() {
  const [teachers, setTeachers] = useState<{ id: number; full_name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: number; class_name: string }[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch teachers and classes
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/teachers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          toast.error("Unauthorized. Please log in again.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch teachers.");
        }

        const data = await response.json();
        setTeachers(data.teachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeacher || !selectedClass) {
      toast.error("Please select both teacher and class.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/assign-teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teacher_id: selectedTeacher,
          class_id: selectedClass,
        }),
      });

      if (res.status === 401) {
        toast.error("Unauthorized. Please log in again.");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Assignment failed.");
      }

      toast.success("Teacher assigned successfully!");
      setSelectedTeacher("");
      setSelectedClass("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Error assigning teacher.");
      } else {
        toast.error("Error assigning teacher.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRole="secretary">
      <div className="flex h-screen bg-muted">
        <div className="w-64 bg-white shadow-lg">
          <SecretarySidebar />
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Assign Teacher to Class</h2>

          <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-md">
            <form onSubmit={handleAssign} className="space-y-6">
              <div>
                <Label>Teacher</Label>
                <Select
                  onValueChange={setSelectedTeacher}
                  value={selectedTeacher}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Class</Label>
                <Select
                  onValueChange={setSelectedClass}
                  value={selectedClass}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.class_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800"
                disabled={loading}
              >
                {loading ? "Assigning..." : "Assign Teacher"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}