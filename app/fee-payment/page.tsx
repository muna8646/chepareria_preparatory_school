"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SecretarySidebar } from "@/components/SecretarySidebar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function ManageFeesPage() {
  const [students, setStudents] = useState<{ id: string; parent_name: string; parent_phone: string; full_name: string; grade: string; last_term_balance: string; }[]>([]);
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [amount, setAmount] = useState("");
  const [mpesaRef, setMpesaRef] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [selectedTerm]);

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/students?term=${selectedTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error("Failed to fetch students.");
        return;
      }
      const data = await res.json();
      setStudents(data.students);
    } catch (error) {
      toast.error("Error fetching students.");
      console.error(error);
    }
  };

  const handlePayment = async (studentId: string): Promise<void> => {
    if (!amount || !mpesaRef) {
      toast.error("Please enter amount and Mpesa reference.");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/record-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ student_id: studentId, amount, mpesa_ref: mpesaRef, term: selectedTerm }),
      });
      if (res.ok) {
        toast.success("Payment recorded successfully!");
        setAmount("");
        setMpesaRef("");
        fetchStudents();
      } else {
        toast.error("Payment failed.");
      }
    } catch (error) {
      toast.error("Error recording payment.");
      console.error(error);
    }
  };

  return (
    <ProtectedRoute allowedRole="secretary">
      <div className="flex h-screen bg-muted">
        <div className="w-64 bg-white shadow-lg">
          <SecretarySidebar />
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {selectedTerm.toUpperCase()} FEES MANAGEMENT
            </h2>

            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent>
                {['Term 1', 'Term 2', 'Term 3'].map(term => (
                  <SelectItem key={term} value={term}>{term}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="max-w-full mx-auto bg-white rounded-lg p-8 shadow-md overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 whitespace-nowrap">PARENT/GUARDIAN</th>
                  <th className="p-2 whitespace-nowrap">TELL. No</th>
                  <th className="p-2 whitespace-nowrap">PUPIL'S NAME</th>
                  <th className="p-2 whitespace-nowrap">GRADE</th>
                  <th className="p-2 whitespace-nowrap">FEES LAST TERM BALANCE</th>
                  <th className="p-2 whitespace-nowrap">M-PESA REF</th>
                  <th className="p-2 whitespace-nowrap">AMOUNT</th>
                  <th className="p-2 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="p-2 whitespace-nowrap">{student.parent_name}</td>
                    <td className="p-2 whitespace-nowrap">{student.parent_phone}</td>
                    <td className="p-2 whitespace-nowrap">{student.full_name}</td>
                    <td className="p-2 whitespace-nowrap">{student.grade}</td>
                    <td className="p-2 whitespace-nowrap">{student.last_term_balance}</td>
                    <td className="p-2 whitespace-nowrap">
                      <Input
                        value={mpesaRef}
                        onChange={(e) => setMpesaRef(e.target.value)}
                        placeholder="M-PESA REF"
                        className="w-full"
                      />
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-full"
                      />
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <Button onClick={() => handlePayment(student.id)} className="bg-green-700 hover:bg-green-800 w-full">
                        Record
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}