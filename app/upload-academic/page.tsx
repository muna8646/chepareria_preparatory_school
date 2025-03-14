"use client";

import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import { TeacherSidebar } from "@/components/TeacherSidebar"; // Update path if necessary

export default function UploadAcademic() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CBC");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent) => {
    setFile(e.target.files[0]);
  };

  interface FetchResponse {
    ok: boolean;
    json(): Promise<any>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !file || !description) {
      setMessage("Please fill all fields and upload a file.");
      return;
    }

    const formData: FormData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("file", file);

    try {
      const res: FetchResponse = await fetch("/api/academic-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Academic material uploaded successfully!");
        setTitle("");
        setDescription("");
        setFile(null);
        setCategory("CBC");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setMessage("An error occurred.");
    }
  };

  return (
    <>
      <Head>
        <title>Upload Academic Materials | Teacher Panel</title>
        <meta name="description" content="Upload CBC, Subject, and Program materials." />
      </Head>

      {/* Layout container */}
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <TeacherSidebar />

        {/* Main content */}
        <main className="flex-1 p-6">
          <motion.div
            className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
              Upload Academic Material
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="CBC">CBC</option>
                  <option value="Subject">Subject</option>
                  <option value="Program">Program</option>
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                  Upload File (PDF / Video / Image)
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="application/pdf,image/*,video/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Upload
              </motion.button>
            </form>

            {message && (
              <p className="mt-4 text-center text-sm text-red-600">
                {message}
              </p>
            )}
          </motion.div>
        </main>
      </div>
    </>
  );
}
