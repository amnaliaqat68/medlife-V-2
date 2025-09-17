"use client";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  LayoutDashboard,
  Stethoscope,
  LogOut,
  PlusCircle,
  Heart,
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
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";

// Import pages
import CSRList from "../CSRs/CSRList/page";
import DoctorManagement from "../DoctorsManage/page";
import DecisionPage from "../CSRs/DescionForCsr/page";
import Createuserpage from "../Users/CreateUsers/page";
import Completedpage from "../CSRs/AdminCompletedCsr/page";
import Approvedpage from "../CSRs/AdminApprovedCsr/page";
import Reportpage from "../FilterReport/Reports/page";

function DashboardContent  () {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [completed, setCompleted] = useState([]);
  const [pending, setPending] = useState([]);
  const [totalCSR, setTotalCSR] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loadingStates, setLoadingStates] = useState({
    user: true,
    csr: true,
    doctors: true,
    reports: true,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  // Helper: navigate while updating query param
  const handleNav = (page) => {
    router.push(`/dashboard?tab=${page}`, { scroll: false });
  };

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Logout successful!");
        router.push("/landing-page/Home");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during logout.");
    }
  };

  // Fetch data
  const fetchAllData = async () => {
    setLoading(true);

    try {
      setLoadingStates((prev) => ({ ...prev, user: true }));
      const userRes = await fetch("/api/auth/userinfo");
      const userData = await userRes.json();

      if (userRes.ok) {
        setUser(userData.user);
        setRole(userData.user?.role);
        setLoadingStates((prev) => ({ ...prev, user: false }));

        const userRole = userData.user?.role;
        const promises = [];

        // Reports
        setLoadingStates((prev) => ({ ...prev, reports: true }));
        promises.push(
          fetch("/api/csrInfo/getreportsCSR", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
              setCompleted(data);
              setLoadingStates((prev) => ({ ...prev, reports: false }));
            })
            .catch(() =>
              setLoadingStates((prev) => ({ ...prev, reports: false }))
            )
        );

        // CSRs
        setLoadingStates((prev) => ({ ...prev, csr: true }));
        let csrEndpoint = "";
        if (userRole === "sm") csrEndpoint = "/api/csrInfo/getCSR";
        if (userRole === "gm") csrEndpoint = "/api/csrInfo/getGMCSR";
        if (userRole === "admin") csrEndpoint = "/api/csrInfo/getadminCSR";

        if (csrEndpoint) {
          promises.push(
            fetch(csrEndpoint)
              .then((res) => res.json())
              .then((data) => {
                setTotalCSR(data);
                const pendingCSR = data.filter((csr) => {
                  if (userRole === "sm") return csr.smStatus === "pending";
                  if (userRole === "gm") return csr.gmStatus === "pending";
                  if (userRole === "admin")
                    return csr.adminStatus === "pending";
                  return false;
                });
                setPending(pendingCSR);
                setLoadingStates((prev) => ({ ...prev, csr: false }));
              })
              .catch(() =>
                setLoadingStates((prev) => ({ ...prev, csr: false }))
              )
          );
        }

        // Doctors
        setLoadingStates((prev) => ({ ...prev, doctors: true }));
        promises.push(
          fetch("/api/doctorsManage/getDoctors")
            .then((res) => res.json())
            .then((data) => {
              if (data) setDoctors(data);
              setLoadingStates((prev) => ({ ...prev, doctors: false }));
            })
            .catch(() =>
              setLoadingStates((prev) => ({ ...prev, doctors: false }))
            )
        );

        await Promise.all(promises);
      } else {
        setLoadingStates((prev) => ({ ...prev, user: false }));
      }
    } catch {
      setLoadingStates({
        user: false,
        csr: false,
        doctors: false,
        reports: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const hasRole = (roles) => roles.includes(role);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r shadow-sm flex flex-col flex-shrink-0 h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 flex-shrink-0">
          <img
            src="/chatgpt.png"
            alt="logo"
            width={40}
            className="transition-transform hover:scale-105"
          />
          <h1 className="text-lg font-bold text-blue-950">MedLife CSR</h1>
        </div>

        {/* Profile Card */}
        <div className="px-4 pb-4 flex-shrink-0">
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center">
              <img src="/profile.png" alt="" />
            </div>
            <h2 className="mt-2 font-semibold text-gray-800 text-sm">
              {user ? user.name : "Loading..."}
            </h2>
            <p className="text-xs text-gray-500">{user?.email || "..."}</p>
            <Badge
              variant="secondary"
              className="mt-1 bg-indigo-600 text-white text-xs"
            >
              {role?.toUpperCase() || "NO ROLE"}
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto min-h-0">
          <button
            onClick={() => handleNav("overview")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
              tab === "overview"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "hover:bg-indigo-50 text-gray-700"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>

          {hasRole(["dsm", "sm", "gm", "admin"]) && (
            <>
              <button
                onClick={() => handleNav("csrlist")}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                  tab === "csrlist"
                    ? "bg-indigo-100 text-indigo-700 font-medium"
                    : "hover:bg-indigo-50 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" /> CSR List
              </button>

              <button
                onClick={() => handleNav("doctors")}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                  tab === "doctors"
                    ? "bg-indigo-100 text-indigo-700 font-medium"
                    : "hover:bg-indigo-50 text-gray-700"
                }`}
              >
                <Stethoscope className="w-5 h-5 font-bold" /> Doctors
              </button>
            </>
          )}

          {role === "dsm" && (
            <button
              onClick={() => router.push("/CSRs/CreatedCSR")}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-indigo-50 text-gray-700 font-bold"
            >
              <PlusCircle className="w-5 h-5" /> Create CSR
            </button>
          )}

          {role === "sm" && (
            <button
              onClick={() => handleNav("descionpage")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                tab === "descionpage"
                  ? "bg-indigo-100 text-indigo-700 font-bold"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FileText className="w-5 h-5" /> Approval CSR
            </button>
          )}

          {role === "gm" && (
            <button
              onClick={() => handleNav("descionpage")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                tab === "descionpage"
                  ? "bg-indigo-100 text-indigo-700 font-bold"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FileText className="w-5 h-5" /> Approval CSR (SM)
            </button>
          )}

          {role === "admin" && (
            <>
              <button
                onClick={() => handleNav("approved")}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                  tab === "approved"
                    ? "bg-indigo-100 text-indigo-700 font-bold"
                    : "hover:bg-indigo-50 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" /> Approved CSR
              </button>
              <button
                onClick={() => handleNav("completed")}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                  tab === "completed"
                    ? "bg-indigo-100 text-indigo-700 font-bold"
                    : "hover:bg-indigo-50 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" /> Completed CSR
              </button>
              <button
                onClick={() => handleNav("reports")}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                  tab === "reports"
                    ? "bg-indigo-100 text-indigo-700 font-bold"
                    : "hover:bg-indigo-50 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" /> Reports
              </button>
              <button
                onClick={() => handleNav("createuser")}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                  tab === "createuser"
                    ? "bg-indigo-100 text-indigo-700 font-medium"
                    : "hover:bg-indigo-50 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" /> Users +
              </button>
            </>
          )}
        </nav>

        {/* Setting */}
        <div className="p-6 border-t">
          <button
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            onClick={() => setOpen(!open)}
          >
            <Settings className="w-4 h-4" /> Setting
          </button>
          {open && (
            <div className="mt-2 p-4 bg-gray-50 border rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-700 mb-2">
                Profile Preview
              </h3>
              <button
                onClick={() => router.push("/Profile")}
                className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Update Profile
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="p-4 border-t bg-white flex-shrink-0">
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 flex items-center gap-2 py-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {tab === "overview" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">
                      Loading your medical dashboard...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Welcome Banner - Redesigned */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-white rounded-3xl mb-8 p-8 shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {/* Subtle Medical Pattern Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-cyan-50/20 to-teal-50/30"></div>

                    {/* Floating Medical Icons */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-6 right-8 opacity-5">
                        <Heart className="w-32 h-32 text-red-500" />
                      </div>
                      <div className="absolute bottom-6 left-8 opacity-5">
                        <Stethoscope className="w-28 h-28 text-blue-500" />
                      </div>
                      <div className="absolute top-1/2 right-1/4 opacity-3">
                        <Activity className="w-24 h-24 text-green-500" />
                      </div>
                    </div>

                    <div className="relative z-10">
                      {/* Header Section */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                              Healthcare Command Center
                            </h1>
                            <p className="text-gray-500 text-sm font-medium">
                              Advanced Medical Management System
                            </p>
                          </div>
                        </div>

                        {/* User Welcome */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">
                            Welcome back,
                          </p>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {loadingStates.user ? "..." : user?.name || "User"}{" "}
                            👨‍⚕️
                          </h2>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                        <p className="text-gray-700 text-lg leading-relaxed">
                          Streamline your healthcare operations with our
                          comprehensive platform for
                          <span className="font-semibold text-blue-600">
                            {" "}
                            patient care coordination
                          </span>
                          ,
                          <span className="font-semibold text-green-600">
                            {" "}
                            medical service requests
                          </span>
                          , and
                          <span className="font-semibold text-purple-600">
                            {" "}
                            provider management
                          </span>{" "}
                          — all in real-time.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Advanced Healthcare Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Patient Service Requests Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="relative overflow-hidden bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-cyan-500/10"></div>
                        <CardContent className="p-8 relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                              <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-right">
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
                              Patient Service Requests
                            </p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-4xl font-black text-gray-800">
                                {loadingStates.csr ? (
                                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                                ) : (
                                  totalCSR.length
                                )}
                              </p>
                              <span className="text-sm font-medium text-green-500">
                                +12%
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">
                              Active Medical Requests
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full w-3/4 transition-all duration-1000"></div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Critical Care Pending Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="relative overflow-hidden bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-400/5 to-red-500/10"></div>
                        <CardContent className="p-8 relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                              <AlertCircle className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-right">
                              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-amber-600 tracking-wide uppercase">
                              Critical Care Pending
                            </p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-4xl font-black text-gray-800">
                                {loadingStates.csr ? (
                                  <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                                ) : (
                                  pending.length
                                )}
                              </p>
                              <span className="text-sm font-medium text-amber-500">
                                urgent
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">
                              Awaiting Medical Review
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full w-2/3 transition-all duration-1000"></div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Treatment Completed Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card className="relative overflow-hidden bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-400/5 to-teal-500/10"></div>
                        <CardContent className="p-8 relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                              <Heart className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-right">
                              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-green-600 tracking-wide uppercase">
                              Treatment Completed
                            </p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-4xl font-black text-gray-800">
                                {loadingStates.reports ? (
                                  <Loader2 className="w-10 h-10 animate-spin text-green-500" />
                                ) : (
                                  completed.length
                                )}
                              </p>
                              <span className="text-sm font-medium text-green-500">
                                +8%
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">
                              Successfully Treated Patients
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full w-5/6 transition-all duration-1000"></div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Medical Staff Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card className="relative overflow-hidden bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-400/5 to-indigo-500/10"></div>
                        <CardContent className="p-8 relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                              <Stethoscope className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-right">
                              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-purple-600 tracking-wide uppercase">
                              Medical Specialists
                            </p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-4xl font-black text-gray-800">
                                {loadingStates.doctors ? (
                                  <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                                ) : (
                                  doctors.length
                                )}
                              </p>
                              <span className="text-sm font-medium text-purple-500">
                                online
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">
                              Certified Healthcare Providers
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-400 to-violet-500 h-full rounded-full w-4/5 transition-all duration-1000"></div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Medical Dashboard Charts and Analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* CSR Status Overview */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="lg:col-span-2"
                    >
                      <Card className="shadow-lg border-0">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                              <BarChart3 className="w-5 h-5 text-blue-600" />
                              CSR Processing Overview
                            </h3>
                            <Badge className="bg-blue-100 text-blue-700">
                              Real-time
                            </Badge>
                          </div>

                          {/* Progress Bars */}
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Pending Requests
                                </span>
                                <span className="text-sm text-gray-500">
                                  {pending.length} of {totalCSR.length}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-500"
                                  style={{
                                    width:
                                      totalCSR.length > 0
                                        ? `${
                                            (pending.length / totalCSR.length) *
                                            100
                                          }%`
                                        : "0%",
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Completed Requests
                                </span>
                                <span className="text-sm text-gray-500">
                                  {completed.length} of {totalCSR.length}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                                  style={{
                                    width:
                                      totalCSR.length > 0
                                        ? `${
                                            (completed.length /
                                              totalCSR.length) *
                                            100
                                          }%`
                                        : "0%",
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Processing Rate
                                </span>
                                <span className="text-sm text-gray-500">
                                  {totalCSR.length > 0
                                    ? Math.round(
                                        (completed.length / totalCSR.length) *
                                          100
                                      )
                                    : 0}
                                  % Complete
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                                  style={{
                                    width:
                                      totalCSR.length > 0
                                        ? `${
                                            (completed.length /
                                              totalCSR.length) *
                                            100
                                          }%`
                                        : "0%",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Card className="shadow-lg border-0">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            Quick Actions
                          </h3>
                          <div className="space-y-3">
                            <button
                              onClick={() => setActivePage("csrlist")}
                              className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-blue-700">
                                  View All CSRs
                                </span>
                              </div>
                            </button>

                            <button
                              onClick={() => setActivePage("doctors")}
                              className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <Stethoscope className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-purple-700">
                                  Manage Doctors
                                </span>
                              </div>
                            </button>

                            {role === "admin" && (
                              <button
                                onClick={() => setActivePage("reports")}
                                className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <BarChart3 className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                                  <span className="text-sm font-medium text-green-700">
                                    View Reports
                                  </span>
                                </div>
                              </button>
                            )}

                            {role === "dsm" && (
                              <button
                                onClick={() => router.push("/CSRs/CreatedCSR")}
                                className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <PlusCircle className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
                                  <span className="text-sm font-medium text-orange-700">
                                    Create New CSR
                                  </span>
                                </div>
                              </button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* System Health Indicators */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-gray-100">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-green-500" />
                          System Health
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">
                              API Status
                            </p>
                            <p className="text-xs text-green-600">Online</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">
                              Active Users
                            </p>
                            <p className="text-xs text-blue-600">
                              {activeUsers}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Calendar className="w-4 h-4 text-purple-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">
                              Last Update
                            </p>
                            <p className="text-xs text-purple-600">Just now</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">
                              Performance
                            </p>
                            <p className="text-xs text-green-600">Optimal</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </>
              )}
            </>
          )}

          {tab === "csrlist" && hasRole(["dsm", "sm", "gm", "admin"]) && (
            <CSRList />
          )}
          {tab === "doctors" && hasRole(["dsm", "sm", "gm", "admin"]) && (
            <DoctorManagement />
          )}
          {tab === "descionpage" && role === "sm" && <DecisionPage />}
          {tab === "descionpage" && role === "gm" && <DecisionPage />}
          {tab === "approved" && role === "admin" && <Approvedpage />}
          {tab === "completed" && role === "admin" && <Completedpage />}
          {tab === "reports" && role === "admin" && <Reportpage />}
          {tab === "createuser" && role === "admin" && <Createuserpage />}
        </div>
      </main>
    </div>
  );
};



export default function UniDashboardpage () {
  return (
    <Suspense fallback={<p>Loading filters...</p>}>
      < DashboardContent />
    </Suspense>
  );
}

