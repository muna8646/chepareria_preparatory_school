"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SecretarySidebar } from "@/components/SecretarySidebar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AdmitStudentPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-generated admission number
  const [nextAdmission, setNextAdmission] = useState("");

  // Student Info
  const [fullName, setFullName] = useState("");
  const [studentClass, setStudentClass] = useState(""); // Will hold the class ID
  const [dateOfAdmission, setDateOfAdmission] = useState(""); // Auto-filled below
  const [role, setRole] = useState("student");

  // Parent/Guardian Info
  const [parentName, setParentName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentAddress, setParentAddress] = useState("");

  // Classes from DB
  const [classes, setClasses] = useState<{ id: number; class_name: string }[]>([]);

  // Fetch latest admission number on mount
  useEffect(() => {
    const fetchLatestAdmissionNumber = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/latest-admission-number", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          toast.error("Failed to fetch the latest admission number.");
          return;
        }

        const data = await res.json();

        // Increment the latest admission number by 1 and format it
        const formattedAdmissionNumber = `ADM${String(data.latest_admission_number + 1).padStart(5, "0")}`;
        setNextAdmission(formattedAdmissionNumber);
      } catch (error) {
        console.error("Error fetching latest admission number:", error);
        toast.error("An error occurred while fetching the latest admission number.");
      }
    };

    fetchLatestAdmissionNumber();
  }, []);

  // Auto-fill current date on mount
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // yyyy-mm-dd
    setDateOfAdmission(formattedDate);
  }, []);

  // Fetch classes from DB
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/classes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          toast.error("Failed to fetch classes.");
          return;
        }

        const data = await res.json();
        setClasses(data.classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("An error occurred fetching classes.");
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !fullName ||
      !nextAdmission || // Now we're using nextAdmission directly
      !studentClass ||
      !dateOfAdmission ||
      !parentName ||
      !relationship ||
      !parentPhone
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newStudent = {
      full_name: fullName,
      admission_number: nextAdmission,
      class_id: studentClass,
      date_of_admission: dateOfAdmission,
      role: role || "student",
      parent_guardian: {
        name: parentName,
        relationship,
        phone: parentPhone,
        email: parentEmail,
        address: parentAddress,
      },
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStudent),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to admit student.");
        return;
      }

      toast.success("Student admitted successfully!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Admission error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRole="secretary">
      <div className="flex h-screen bg-muted">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <SecretarySidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
            Admit New Student
          </h2>

          {isSubmitted ? (
            <div className="max-w-3xl mx-auto bg-background rounded-lg p-8 shadow-md">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <svg
                    className="h-16 w-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">
                  Student Admitted Successfully!
                </h3>
                <p className="text-muted-foreground">
                  The student's information and guardian details have been securely saved.
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    router.push("/secretary-dashboard");
                  }}
                  className="mt-4"
                >
                  Admit Another Student
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto bg-background rounded-lg p-6 md:p-8 shadow-md">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Student Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter student's full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="admissionNumber">Admission Number</Label>
                      <Input
                        id="admissionNumber"
                        placeholder="Auto-generated admission number"
                        value={nextAdmission}
                        readOnly // ✅ Make it read-only
                      />
                    </div>

                    <div>
                      <Label htmlFor="studentClass">Class</Label>
                      <Select
                        onValueChange={(value) => setStudentClass(value)}
                        value={studentClass}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem
                              key={cls.id}
                              value={cls.id.toString()}
                            >
                              {cls.class_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dateOfAdmission">Date of Admission</Label>
                      <Input
                        id="dateOfAdmission"
                        type="date"
                        value={dateOfAdmission}
                        onChange={(e) => setDateOfAdmission(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Parent/Guardian Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Parent/Guardian Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="parentName">Full Name</Label>
                      <Input
                        id="parentName"
                        placeholder="Enter parent/guardian's name"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        onValueChange={(value) => setRelationship(value)}
                        value={relationship}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Mother", "Father", "Guardian", "Grandparent", "Sponsor"].map((relation) => (
                            <SelectItem key={relation} value={relation}>
                              {relation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="parentPhone">Phone Number</Label>
                      <Input
                        id="parentPhone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="parentEmail">Email Address</Label>
                      <Input
                        id="parentEmail"
                        type="email"
                        placeholder="Enter email (optional)"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="parentAddress">Address</Label>
                      <Textarea
                        id="parentAddress"
                        placeholder="Full home address"
                        value={parentAddress}
                        onChange={(e) => setParentAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-700 text-white hover:bg-green-800"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Admit Student"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
