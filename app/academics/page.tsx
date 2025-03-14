import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function UploadSubjectForm() {
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Remove the custom FormData interface

  interface FetchResponse {
    ok: boolean;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData: FormData = new FormData();
    formData.append("subject_name", subjectName);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }

    try {
      const res: FetchResponse = await fetch("/api/upload-subject", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Uploaded successfully!");
        // Reset form
        setSubjectName("");
        setDescription("");
        setFile(null);
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <Tabs defaultValue="cbc" className="w-full max-w-2xl mx-auto">
        <TabsList>
          <TabsTrigger value="cbc">CBC</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>

        {["cbc", "subjects", "programs"].map((group) => (
          <TabsContent key={group} value={group}>
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="space-y-4 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subject Name
                    </label>
                    <Input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="Enter subject name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Document / Video / Image
                    </label>
                    <Input type="file" onChange={handleFileChange} required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter a description"
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Upload {group.charAt(0).toUpperCase() + group.slice(1)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
