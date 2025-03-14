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

export default function ManageFeesPage() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  interface StudentDetails {
    parent_name: string;
    parent_phone: string;
    full_name: string;
    grade: string;
    last_term_balance: number;
    current_balance: number;
    payment_history?: {
      id: string;
      mpesa_ref?: string;
      date: string;
      time: string;
      amount: number;
      balance_after: number;
    }[];
  }

  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [mpesaRef, setMpesaRef] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setPaymentDate(today);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch("http://localhost:5000/students", {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          if (!res.ok) {
            toast.error("Failed to fetch students.");
            return;
          }
      
          const data = await res.json();
          console.log("Fetched students:", data); // <-- Inspect here
          setStudents(data.students || []);
        } catch (error) {
          toast.error("Error fetching students.");
          console.error(error);
        }
      };
      

    fetchStudents();
  }, []);

  const handleStudentSelect = async (studentId: string) => {
    setSelectedStudent(studentId);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/student-details/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        toast.error("Failed to fetch student details.");
        return;
      }

      const data = await res.json();
      setStudentDetails(data.student);
    } catch (error) {
      toast.error("Error fetching student details.");
      console.error(error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent || !amount || !paymentDate || !paymentMethod) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/record-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: selectedStudent,
          amount,
          payment_date: paymentDate,
          payment_method: paymentMethod,
          mpesa_ref: mpesaRef,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Payment recording failed.");
        return;
      }

      toast.success("Payment recorded successfully!");
      setAmount("");
      setPaymentMethod("");
      setMpesaRef("");
      handleStudentSelect(selectedStudent); // refresh details
    } catch (error) {
      toast.error("Error recording payment.");
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
          <h2 className="text-3xl font-bold mb-8 text-center">
            TERM 1, 2025 FEES (M-PESA FEE PAYMENTS)
          </h2>

          <div className="max-w-5xl mx-auto bg-white rounded-lg p-8 shadow-md space-y-8">
            <div>
              <Label>Student</Label>
              <Select onValueChange={handleStudentSelect} value={selectedStudent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student: any) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.full_name} - {student.admission_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {studentDetails && (
              <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold mb-4">Student Details</h3>

                {/* TABLE for Student Details */}
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Parent/Guardian</td>
                      <td className="border px-4 py-2">{studentDetails.parent_name}</td>
                      <td className="border px-4 py-2 font-semibold">Phone</td>
                      <td className="border px-4 py-2">{studentDetails.parent_phone}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Pupil's Name</td>
                      <td className="border px-4 py-2">{studentDetails.full_name}</td>
                      <td className="border px-4 py-2 font-semibold">Grade</td>
                      <td className="border px-4 py-2">{studentDetails.grade}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Fees Last Term Balance</td>
                      <td className="border px-4 py-2">Ksh {studentDetails.last_term_balance}</td>
                      <td className="border px-4 py-2 font-semibold">Current Balance</td>
                      <td className="border px-4 py-2">Ksh {studentDetails.current_balance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* FORM in a TABLE format */}
            <form onSubmit={handlePayment}>
              <table className="w-full text-left border-collapse">
                <tbody>
                  {paymentMethod === "Mpesa" && (
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        <Label>Mpesa Reference</Label>
                      </td>
                      <td className="border px-4 py-2">
                        <Input
                          type="text"
                          placeholder="Enter Mpesa Reference"
                          value={mpesaRef}
                          onChange={(e) => setMpesaRef(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td className="border px-4 py-2 font-semibold">
                      <Label>Amount (Ksh)</Label>
                    </td>
                    <td className="border px-4 py-2">
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="border px-4 py-2 font-semibold">
                      <Label>Payment Date</Label>
                    </td>
                    <td className="border px-4 py-2">
                      <Input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="border px-4 py-2 font-semibold">
                      <Label>Payment Method</Label>
                    </td>
                    <td className="border px-4 py-2">
                      <Select
                        onValueChange={setPaymentMethod}
                        value={paymentMethod}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Method" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Cash", "Mpesa", "Bank Transfer", "Cheque"].map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={2} className="text-center py-4">
                      <Button
                        type="submit"
                        className="bg-green-700 hover:bg-green-800 w-1/2"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Record Payment"}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>

            {/* Payment History */}
            {(studentDetails?.payment_history?.length ?? 0) > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-bold mb-4">Payment History</h3>
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">M-PESA REF</th>
                      <th className="border px-4 py-2">DATE</th>
                      <th className="border px-4 py-2">TIME</th>
                      <th className="border px-4 py-2">AMOUNT</th>
                      <th className="border px-4 py-2">TOTAL BALANCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentDetails?.payment_history?.map((payment: any) => (
                      <tr key={payment.id}>
                        <td className="border px-4 py-2">{payment.mpesa_ref || "-"}</td>
                        <td className="border px-4 py-2">{payment.date}</td>
                        <td className="border px-4 py-2">{payment.time}</td>
                        <td className="border px-4 py-2">Ksh {payment.amount}</td>
                        <td className="border px-4 py-2">Ksh {payment.balance_after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
