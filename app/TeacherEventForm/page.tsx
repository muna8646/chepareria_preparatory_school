"use client";

import { useState } from "react";
import { TeacherSidebar } from "../../components/TeacherSidebar";

export default function AddEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "sports",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("time", formData.time);
    data.append("location", formData.location);
    data.append("category", formData.category);
  
    if (imageFile) {
      data.append("image", imageFile);
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        body: data,
      });
  
      if (res.ok) {
        setMessage({ type: "success", text: "✅ Event added successfully!" });
  
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          category: "sports",
        });
        setImageFile(null);
      } else {
        let errorMsg = "Unknown error";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (err) {
          console.error("Failed to parse error response:", err);
        }
  
        setMessage({
          type: "error",
          text: `❌ Failed to add event: ${errorMsg}`,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        type: "error",
        text: "❌ An error occurred while submitting the form.",
      });
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main content */}
      <main className="flex-1 p-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto p-6 bg-white rounded shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4">Add New Event</h2>

          {message && (
            <div
              className={`mb-4 p-2 rounded ${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full mb-3 p-2 border rounded"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full mb-3 p-2 border rounded"
            required
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
            required
          />

          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="Time (e.g., 8:00 AM - 4:00 PM)"
            className="w-full mb-3 p-2 border rounded"
            required
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full mb-3 p-2 border rounded"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          >
            <option value="sports">Sports</option>
            <option value="academic">Academic</option>
            <option value="meeting">Meeting</option>
            <option value="cultural">Cultural</option>
            <option value="ceremony">Ceremony</option>
          </select>

          {/* File input for the image */}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full mb-3 p-2 border rounded"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Event
          </button>
        </form>
      </main>
    </div>
  );
}
