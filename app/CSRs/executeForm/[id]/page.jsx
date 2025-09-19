"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FileText,
  LayoutDashboard,
  Stethoscope,
  LogOut,
  PlusCircle,
  Heart,
  CheckCircle,
  Search,
  Shield,
  Activity,
  TrendingUp,
  Calendar,
  BarChart3,
  Loader2,
  AlertCircle,
  UserCheck,
  Zap,
  Settings,
} from "lucide-react";

export default function ExecuteCSRPage() {
  const [particulars, setParticulars] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [activity, setActivity] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const router = useRouter();
  const params = useParams();
  const csrId = params.id;
  const [loadingStates, setLoadingStates] = useState({
    user: true,
    csr: true,
    doctors: true,
    reports: true,
  });
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, date, particulars, file });

    const formData = new FormData();
    formData.append("executedBy", name);
    formData.append("executeDate", date);
    formData.append("particulars", particulars);
     formData.append("exactCost", activity); 
    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch(`/api/auth/execute/${csrId}`, {
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
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Execution failed");
    }
  };
  useEffect(() => {
    const fetchCSR = async () => {
      try {
        const res = await fetch("/api/csrInfo/getadminCSR");
        const data = await res.json();
        console.log("Fetched CSR data:", JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
          const currentCsr = data.find((csr) => csr._id === csrId);

          if (currentCsr) {
            const cost = currentCsr?.Business?.[0]?.exactCost ?? "";
            setActivity(cost);
          }
        }
      } catch (err) {
        console.error("Error fetching CSR:", err);
      }
    };

    fetchCSR();
  }, []);

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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex flex-col  p-4">
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-teal-800 rounded-2xl p-6 mb-6 overflow-hidden">
        {/* Medical background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4">
            <FileText className="w-16 h-16 text-white" />
          </div>
          <div className="absolute top-8 right-8">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute bottom-4 right-1/4">
            <Search className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold mb-3">Execute CSR</h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            Comprehensive medical service request management system for tracking
            patient care, medication requests, and healthcare provider
            coordination.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-5"
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
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="comment"
            className="text-sm font-medium text-gray-700"
          >
            Execution Cost
          </label>
          <input
            id="activity"
            type="number"
            name="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="Activity Cost"
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
            className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-teal-800 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold transition"
          >
            Submit Execution
          </button>
        </div>
      </form>
    </div>
  );
}
