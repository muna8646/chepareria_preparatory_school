"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import { Sidebar } from "@/components/Sidebar";

import { UserCheck, LogOut, Edit, Trash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [secretaries, setSecretaries] = useState<Secretary[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    if (typeof window !== "undefined" && isMounted) {
      fetchTeachers();
      fetchStudents();
      fetchSecretaries();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  async function fetchTeachers() {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        handleLogout();
        return;
      }

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
      toast.error("Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStudents() {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        handleLogout();
        return;
      }

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

  async function fetchSecretaries() {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/secretaries", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        handleLogout();
        return;
      }

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setSecretaries(data);
    } catch (err) {
      console.error("Failed to fetch secretaries", err);
      toast.error("Failed to load secretaries.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    router.push("/");
  }

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-bold flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-green-500" /> {teachers.length}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-bold flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-blue-500" /> {students.length}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Secretaries</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-bold flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-purple-500" /> {secretaries.length}
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <Tabs defaultValue="teachers">
              <TabsList className="mb-4">
                <TabsTrigger value="teachers">Teachers</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="secretaries">Secretaries</TabsTrigger>
              </TabsList>

              {/* Teachers Tab */}
              <TabsContent value="teachers">
                <UserTable
                  users={teachers}
                  type="teacher"
                  refreshData={fetchTeachers}
                />
              </TabsContent>

              {/* Students Tab */}
              <TabsContent value="students">
                <UserTable
                  users={students}
                  type="student"
                  refreshData={fetchStudents}
                />
              </TabsContent>

              {/* Secretaries Tab */}
              <TabsContent value="secretaries">
                <UserTable
                  users={secretaries}
                  type="secretary"
                  refreshData={fetchSecretaries}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface Teacher {
  id: number;
  full_name: string;
  phone_number: string;
  specialization: string;
  qualification: string;
  date_of_hire: string;
  role: string;
}

interface Student {
  id: number;
  full_name: string;
  admission_number: string;
  class: string;
  date_of_admission: string;
  role: string;
}

interface Secretary {
  id: number;
  full_name: string;
  phone_number: string;
  department: string;
  date_of_hire: string;
  role: string;
}

interface UserTableProps {
  users: Teacher[] | Student[] | Secretary[];
  type: "teacher" | "student" | "secretary";
  refreshData?: () => void;
}

function UserTable({ users, type, refreshData }: UserTableProps) {
  const [editUser, setEditUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const openEditDialog = (user: any) => {
    setFormValues(user);
    setEditUser(user);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formValues) return;
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

async function handleUpdate() {
  if (!formValues) return;

  setLoading(true);
  try {
    const token = localStorage.getItem("token");

    let endpoint = "";
    if (type === "teacher") endpoint = `http://localhost:5000/users/${formValues.id}`;
    if (type === "student") endpoint = `http://localhost:5000/users/${formValues.id}`;
    if (type === "secretary") endpoint = `http://localhost:5000/users/${formValues.id}`;

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formValues),
    });

    if (res.status === 401) {
      toast.error("Session expired. Please login again.");
      return;
    }

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    setIsDialogOpen(false);
    refreshData?.();
    toast.success(`${capitalize(type)} updated successfully!`);
  } catch (err) {
    console.error("Failed to update", err);
    toast.error(`Failed to update ${type}!`);
  } finally {
    setLoading(false);
  }
}

  async function handleDelete(id: number) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      let endpoint = "";
      if (type === "teacher") endpoint = `http://localhost:5000/teachers/${id}`;
      if (type === "student") endpoint = `http://localhost:5000/students/${id}`;
      if (type === "secretary") endpoint = `http://localhost:5000/secretaries/${id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        return;
      }

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      refreshData?.();
      toast.success(`${capitalize(type)} deleted successfully!`);
    } catch (err) {
      console.error("Failed to delete", err);
      toast.error(`Failed to delete ${type}!`);
    } finally {
      setLoading(false);
    }
  }

  function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {(type === "teacher" || type === "secretary") && <TableHead>Phone</TableHead>}
            {type === "teacher" && <TableHead>Specialization</TableHead>}
            {type === "teacher" && <TableHead>Qualification</TableHead>}
            {type === "teacher" && <TableHead>Date of Hire</TableHead>}
            {type === "student" && <TableHead>Admission No.</TableHead>}
            {type === "student" && <TableHead>Class</TableHead>}
            {type === "student" && <TableHead>Date of Admission</TableHead>}
            {type === "secretary" && <TableHead>Department</TableHead>}
            {type === "secretary" && <TableHead>Date of Hire</TableHead>}
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length > 0 ? (
            users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                {(type === "teacher" || type === "secretary") && (
                  <TableCell>{user.phone_number}</TableCell>
                )}
                {type === "teacher" && <TableCell>{user.specialization}</TableCell>}
                {type === "teacher" && <TableCell>{user.qualification}</TableCell>}
                {type === "teacher" && (
                  <TableCell>{new Date(user.date_of_hire).toLocaleDateString()}</TableCell>
                )}
                {type === "student" && <TableCell>{user.admission_number}</TableCell>}
                {type === "student" && <TableCell>{user.class}</TableCell>}
                {type === "student" && (
                  <TableCell>{new Date(user.date_of_admission).toLocaleDateString()}</TableCell>
                )}
                {type === "secretary" && <TableCell>{user.department}</TableCell>}
                {type === "secretary" && (
                  <TableCell>{new Date(user.date_of_hire).toLocaleDateString()}</TableCell>
                )}
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    disabled={loading}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                {loading ? "Loading..." : `No ${type}s found.`}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {capitalize(type)}</DialogTitle>
          </DialogHeader>

          {formValues && (
            <div className="space-y-4">
              <Input
                name="full_name"
                value={formValues.full_name}
                onChange={handleInputChange}
                placeholder="Full Name"
              />

              {(type === "teacher" || type === "secretary") && (
                <Input
                  name="phone_number"
                  value={formValues.phone_number}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                />
              )}

              {type === "teacher" && (
                <>
                  <Input
                    name="specialization"
                    value={formValues.specialization}
                    onChange={handleInputChange}
                    placeholder="Specialization"
                  />
                  <Input
                    name="qualification"
                    value={formValues.qualification}
                    onChange={handleInputChange}
                    placeholder="Qualification"
                  />
                </>
              )}

              {type === "student" && (
                <>
                  <Input
                    name="admission_number"
                    value={formValues.admission_number}
                    onChange={handleInputChange}
                    placeholder="Admission Number"
                  />
                  <Input
                    name="class"
                    value={formValues.class}
                    onChange={handleInputChange}
                    placeholder="Class"
                  />
                </>
              )}

              {type === "secretary" && (
                <Input
                  name="department"
                  value={formValues.department}
                  onChange={handleInputChange}
                  placeholder="Department"
                />
              )}

              <Input
                name="role"
                value={formValues.role}
                onChange={handleInputChange}
                placeholder="Role"
              />

              <Button onClick={handleUpdate} className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
