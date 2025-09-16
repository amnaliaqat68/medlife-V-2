"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ClipboardCheck, FileText, ShieldCheck, BarChart3 } from "lucide-react"; // icons

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password},
        { withCredentials: true }
      );

      if (response.status === 200) {
        const data = response.data;
        if (
          ["superAdmin", "admin", "sm", "gm", "dsm"].includes(data.user.role)
        ) {
          router.push("/dashboard"); // ✅ one dashboard for all roles
        } else {
          setError("Unknown role. Please contact support.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(
        error.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 sm:px-12 py-4 bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/Medlife logo.png"
            alt="MedLife Logo"
            className="w-15 h-10 object-contain"
          />
          <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">
            MedLife
          </h1>
        </div>
        {/* <div className="flex items-center gap-4">
          <Link
            href="/landing-page/signup"
            className="hidden sm:inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-all"
          >
            Sign Up
          </Link>
        </div> */}
      </header>

      {/* Hero + Login */}
      <section className="flex flex-1 flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-12 py-16 sm:py-24 gap-12">
        {/* Hero Content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-900 leading-tight">
            Digitizing CSR Workflows with{" "}
            <span className="text-teal-500">MedCSR</span>
          </h2>
          <p className="mt-6 text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            MedCSR empowers MedLife to manage doctor commitments, streamline CSR
            approvals, and ensure compliance—all through a secure, modern, and
            role-based platform.
          </p>
          <div className="mt-8 flex justify-center lg:justify-start gap-4">
            <a
              href="#login"
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="border border-teal-500 text-teal-600 hover:bg-teal-50 px-6 py-3 rounded-lg font-semibold transition"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Login Card */}
        <div
          id="login"
          className="flex-1 max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-center text-indigo-900 mb-6">
            Login to MedCSR
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
            />
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-semibold shadow-md transition"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-5">
           
            <Link
              href="/ForgotP"
              className="text-teal-500 hover:text-teal-600 font-semibold"
            >
              Forget Password?{" "}
            </Link>
          </p>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="bg-gradient-to-br from-white via-indigo-50 to-teal-50 py-20 px-6 sm:px-12"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-indigo-900 mb-4">
              About MedLife
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              MedLife is a trusted pharmaceutical company committed to
              delivering innovative and effective medicines. Through MedCSR, we
              uphold our dedication to transparency, compliance, and ethical
              partnerships with doctors, patients, and healthcare providers.
            </p>
          </div>
          <div>
            <img
              src="https://plus.unsplash.com/premium_photo-1681995751324-462c07cf331d?w=600&auto=format&fit=crop&q=60"
              alt="MedLife Office"
              className="rounded-2xl shadow-xl border border-gray-200 w-full max-h-[350px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-20 px-6 sm:px-12 bg-white border-t border-gray-200"
      >
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">
            Key Features of MedCSR
          </h2>
          <p className="text-gray-600 text-lg">
            Simplifying CSR workflows for better compliance, transparency, and
            efficiency.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1 */}
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <ClipboardCheck className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">
              Doctor Commitments
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Track and manage doctor commitments digitally with complete
              transparency and accountability.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <FileText className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">
              CSR Approvals
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Multi-level approval workflows designed for speed, compliance, and
              role-based access.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <ShieldCheck className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">
              Compliance First
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ensure ethical practices and compliance with built-in audit
              tracking and monitoring tools.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <BarChart3 className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">
              Analytics & Reports
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Access real-time insights and detailed reports to make informed,
              data-driven decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-center text-gray-500 text-sm py-6 border-t border-gray-200">
        © {new Date().getFullYear()} MedLife Pharmaceuticals. All rights
        reserved.
      </footer>
    </main>
  );
}
