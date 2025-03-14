"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";

export default function RegisterSecretary() {
  const initialFormState = {
    full_name: "",
    email: "",
    phone_number: "",
    national_id: "",
    address: "",
    specialization: "",
    qualification: "",
    date_of_hire: "",
    password: "",
    username: "", // ✅ Added username field
    role: "Secretary", // Always fixed for this page
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle form submission
  async function handleRegisterSecretary(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate required fields for backend (username, role, password)
      if (!formData.username || !formData.role || !formData.password) {
        throw new Error("Username, role, and password are required.");
      }

      const payload = {
        ...formData,
        role: "Secretary", // Ensure role stays Secretary
      };

      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register secretary.");
      }

      setSuccessMessage("✅ Secretary registered successfully!");
      setFormData(initialFormState); // Clear the form
    } catch (error) {
      setError((error as Error).message);
      console.error("❌ Error registering secretary:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-6 flex-1 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Register a Secretary</h1>

        {/* Error/Success Messages */}
        {error && <p className="text-red-600 font-semibold mb-4">❌ {error}</p>}
        {successMessage && (
          <p className="text-green-600 font-semibold mb-4">✅ {successMessage}</p>
        )}

        <form
          onSubmit={handleRegisterSecretary}
          className="space-y-3 max-w-lg bg-white p-6 rounded-lg shadow-md"
        >
          {/* Username (required by backend) */}
          <Input
            name="username"
            placeholder="Username (unique)"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Input
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />

          <Input
            name="national_id"
            placeholder="National ID"
            value={formData.national_id}
            onChange={handleChange}
            required
          />

          <Input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <Input
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />

          <Input
            name="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
          />

          <Input
            type="date"
            name="date_of_hire"
            value={formData.date_of_hire}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Secretary"}
          </Button>
        </form>
      </div>
    </div>
  );
}
