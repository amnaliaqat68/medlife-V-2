"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function loginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/login", form, {
        withCredentials: true 
      });
      
      if (response.status === 200) {
         const data = response.data; 
            
        
      if (data.user.role === "superAdmin") {
          router.push("/Superadmin/dashboard");
        } else if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else if (data.user.role === "dsm") {
          router.push("/SMuser/dashboard");
        } else {
          setError("Unknown role. Contact system admin.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 text-center">
       
          Login to MedCSR
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all bg-gray-50 text-sm"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all bg-gray-50 text-sm"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded-md font-medium shadow-sm transition-colors duration-200 text-sm"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            href="/landing-page/signup"
            className="text-teal-500 hover:text-teal-600 font-semibold transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
