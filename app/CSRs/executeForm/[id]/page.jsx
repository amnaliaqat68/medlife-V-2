"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ExecuteCSRPage() {
  const [particulars, setParticulars] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const router = useRouter();
  const params = useParams();
   const csrId = params.id;
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, date, particulars, file });

    const formData = new FormData();
    formData.append("executedBy", name);
    formData.append("executeDate", date);
    formData.append("particulars", particulars);
    if (file) {
      formData.append("file", file);
    }

    try {
     const res =  await fetch(`/api/auth/execute/${csrId}`, {
  method: "POST",
  body: formData,
});

     let data = {};
try {
  data = await res.json();
} catch (_) {
  data = { message: "No JSON response received" };
}
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success("CSR executed successfully!");
      router.push('/admin/dashboard')
    } catch (err) {
      console.error(err);
      toast.error("Execution failed");
    }
  };
  const handleUpload = async (selectedFile) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "file_preset");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/det4apayu/auto/upload",
        formData
      );
      setUploadedUrl(response.data.secure_url);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("File upload failed");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 space-y-5"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Execute CSR
        </h2>

        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Executed By
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">
            Execution Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label
            htmlFor="comment"
            className="text-sm font-medium text-gray-700"
          >
            Particulars
          </label>
          <input
            id="particulars"
            type="text"
            name="particulars"
            value={particulars}
            onChange={(e) => setParticulars(e.target.value)}
            placeholder="Write any instructions"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <section className="mt-6 print:hidden">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attach Sales Report
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
            className="border-2 border-gray-300 p-2 rounded-lg w-full sm:w-auto"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (!selectedFile) return;
              setFile(selectedFile);
              handleUpload(selectedFile);
            }}
          />
        </section>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold transition"
          >
            Submit Execution
          </button>
        </div>
      </form>
    </div>
  );
}
