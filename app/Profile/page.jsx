"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  CheckCircle,
  Stethoscope,
  User,
  PlusCircle,
  Clock,
  Heart,
  Shield,
  Calendar,
  BarChart3,
  AlertCircle,
  UserCheck,
  Zap,
  Activity,
  Loader2,
  LayoutDashboard,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import CSRList from "../CSRs/CSRList/page";
import DoctorManagement from "../DoctorsManage/page";
import DecisionPage from "../CSRs/DescionForCsr/page";
import Createuserpage from "../Users/CreateUsers/page";
import Completedpage from "../CSRs/AdminCompletedCsr/page";
import Approvedpage from "../CSRs/AdminApprovedCsr/page";
import Reportpage from "../FilterReport/Reports/page";
import CSRForm from "../CSRs/CreatedCSR/page";

export default function ProfileSettings() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [completed, setCompleted] = useState([]);
  const [pending, setPending] = useState([]);
  const [totalCSR, setTotalCSR] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activePage, setActivePage] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loadingStates, setLoadingStates] = useState({
    user: true,
    csr: true,
    doctors: true,
    reports: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
  });

  // 🔹 Logout handler
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
    } catch {
      toast.error("An error occurred during logout.");
    }
  };
  const fetchAllData = async () => {
    setLoading(true);

    try {
      // Fetch user info first
      setLoadingStates((prev) => ({ ...prev, user: true }));
      const userRes = await fetch("/api/auth/userinfo");
      const userData = await userRes.json();

      if (userRes.ok) {
        setUser(userData.user);
        setRole(userData.user?.role);
        setLoadingStates((prev) => ({ ...prev, user: false }));

        const userRole = userData.user?.role;

        // Parallel fetch of other data based on role
        const promises = [];

        // Fetch reports
        setLoadingStates((prev) => ({ ...prev, reports: true }));
        promises.push(
          fetch("/api/csrInfo/getreportsCSR", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
              setCompleted(data);
              setLoadingStates((prev) => ({ ...prev, reports: false }));
            })
            .catch((err) => {
              console.error("Fetch reports failed", err);
              setLoadingStates((prev) => ({ ...prev, reports: false }));
            })
        );

        // Fetch CSRs based on role
        setLoadingStates((prev) => ({ ...prev, csr: true }));
        let csrEndpoint = "";
        if (userRole === "sm") {
          csrEndpoint = "/api/csrInfo/getCSR";
        } else if (userRole === "gm") {
          csrEndpoint = "/api/csrInfo/getGMCSR";
        } else if (userRole === "admin") {
          csrEndpoint = "/api/csrInfo/getadminCSR";
        }

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
              .catch((err) => {
                console.error("Error fetching CSR:", err);
                setLoadingStates((prev) => ({ ...prev, csr: false }));
              })
          );
        } else {
          setLoadingStates((prev) => ({ ...prev, csr: false }));
        }

        // Fetch doctors
        setLoadingStates((prev) => ({ ...prev, doctors: true }));
        promises.push(
          fetch("/api/doctorsManage/getDoctors")
            .then((res) => res.json())
            .then((data) => {
              if (data) setDoctors(data);
              setLoadingStates((prev) => ({ ...prev, doctors: false }));
            })
            .catch((err) => {
              console.error("Error fetching doctors:", err);
              setLoadingStates((prev) => ({ ...prev, doctors: false }));
            })
        );

        // Wait for all promises to complete
        await Promise.all(promises);
      } else {
        setLoadingStates((prev) => ({ ...prev, user: false }));
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setLoadingStates((prev) => ({
        user: false,
        csr: false,
        doctors: false,
        reports: false,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 🔹 Fetch user info
  const fetchUserInfo = async () => {
    try {
      const res = await fetch("/api/auth/userinfo", { credentials: "include" });
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        setRole(data.user.role || "");
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          district: data.user.district || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

 

  // 🔹 Save profile changes
  const handleSave = async () => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated!");
        setIsEditing(false);
        fetchUserInfo(); // refresh UI
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch {
      toast.error("Something went wrong while updating profile.");
    }
  };
  useEffect(() => {
    fetchActiveUsers();
    fetchUserInfo();
    const interval = setInterval(fetchActiveUsers, 30000);
    return () => clearInterval(interval);
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
            <p className="text-xs text-gray-500">
              {user?.email || "Loading..."}
            </p>
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
            onClick={() => setActivePage("overview")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
              activePage === "overview"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "hover:bg-indigo-50 text-gray-700 "
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>

          {/* CSR List + Doctors (shared by DSM, SM, GM) */}
          {hasRole(["dsm", "sm", "gm", "admin"]) && (
            <>
              <button
                onClick={() => setActivePage("csrlist")}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                  activePage === "csrlist"
                    ? "bg-indigo-100 text-indigo-700 font-medium"
                    : "hover:bg-indigo-50 text-gray-700 "
                }`}
              >
                <FileText className="w-5 h-5" /> CSR List
              </button>

              <button
                onClick={() => setActivePage("doctors")}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                  activePage === "doctors"
                    ? "bg-indigo-100 text-indigo-700 "
                    : "hover:bg-indigo-50 text-gray-700 "
                }`}
              >
                <Stethoscope className="w-5 h-5 font-bold" /> Doctors
              </button>
            </>
          )}

          {/* Role-specific navigation */}
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
              onClick={() => setActivePage("descionpage")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                activePage === "descionpage"
                  ? "bg-indigo-100 text-indigo-700  font-bold"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FileText className="w-5 h-5" /> Approval CSR
            </button>
          )}

          {role === "gm" && (
            <button
              onClick={() => setActivePage("descionpage")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                activePage === "descionpage"
                  ? "bg-indigo-100 text-indigo-700 font-bold"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FileText className="w-5 h-5" /> Approval CSR (SM)
            </button>
          )}
          {role === "admin" && (
            <button
              onClick={() => setActivePage("approved")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                activePage === "approved"
                  ? "bg-indigo-100 text-indigo-700 font-bold"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FileText className="w-5 h-5" /> Approved CSR
            </button>
          )}
          {role === "admin" && (
            <button
              onClick={() => setActivePage("completed")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                activePage === "completed"
                  ? "bg-indigo-100 text-indigo-700 font-bold"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FileText className="w-5 h-5" /> Completed CSR
            </button>
          )}
          {role === "admin" && (
            <button
              onClick={() => setActivePage("reports")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                activePage === "reports"
                  ? "bg-indigo-100 text-indigo-700 font-bold"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FileText className="w-5 h-5" /> Reports
            </button>
          )}
          {role === "admin" && (
            <button
              onClick={() => setActivePage("createuser")}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg ${
                activePage === "createuser"
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <FileText className="w-5 h-5" /> Create User
            </button>
          )}

          {/* Admin/GM extra option */}
        </nav>
        {/* Setting */}
        <div className="p-6 border-t">
          <button
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            onClick={() => setOpen(!open)}
          >
            <Settings className="w-4 h-4" /> Setting
          </button>

          {/* Expandable Profile Preview */}
          {open && (
            <div className="mt-2 p-4 bg-gray-50 border rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-700 mb-2">
                Profile Preview
              </h3>

              {/* Navigate to full profile page */}
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
      <main className="flex-1 flex overflow-hidden bg-gray-50">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow">
                <h2 className="text-2xl font-bold tracking-wide">
                  User Dashboard
                </h2>
                <p className="text-sm opacity-90">
                  Your profile & system insights
                </p>
              </div>

              {/* Profile Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Card - Avatar & Basic Info */}
                <Card className="shadow-sm border rounded-2xl md:col-span-1">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-100 shadow mb-4">
                      <img
                        src={user?.profileImage || "/profile.png"}
                        alt="profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {formData.name}
                    </h2>
                    <p className="text-sm text-indigo-600 font-semibold">
                      {role?.toUpperCase() || "NO ROLE"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "—"}
                    </p>

                    <div className="mt-5 flex gap-3">
                      <Button className="bg-indigo-600 text-white shadow">
                        Follow
                      </Button>
                      <Button variant="outline">Message</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Right Card - User Details */}
                <Card className="shadow-sm border rounded-2xl md:col-span-2">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                      Profile Details
                    </h3>

                    {!isEditing ? (
                      <div className="space-y-3">
                        {[
                          { label: "Full Name", value: formData.name },
                          { label: "Email", value: formData.email },
                          { label: "Phone", value: formData.phone || "—" },
                          { label: "Address", value: formData.district || "—" },
                        ].map((field, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm text-gray-700"
                          >
                            <span className="font-medium text-gray-500">
                              {field.label}
                            </span>
                            <span>{field.value}</span>
                          </div>
                        ))}

                        <div className="mt-5 flex justify-between items-center">
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-indigo-600"
                          >
                            Edit
                          </Button>
                          <Link
                            href="/ForgotP"
                            className="text-indigo-600 hover:underline text-sm font-medium"
                          >
                            Update Password?
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {["name", "phone", "district"].map((field) => (
                            <div key={field} className="flex flex-col">
                              <label className="text-xs font-semibold text-gray-500 mb-1 capitalize">
                                {field}
                              </label>
                              <input
                                type="text"
                                name={field}
                                value={formData[field]}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    [field]: e.target.value,
                                  }))
                                }
                                className="p-2 border rounded-lg text-sm focus:ring focus:ring-indigo-300"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSave}
                            className="bg-indigo-600"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* System Health */}
              <Card className="shadow-sm border rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    System Health
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xs font-medium text-gray-500">
                        API Status
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        Online
                      </p>
                    </div>
                    <div className="text-center">
                      <UserCheck className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-500">
                        Active Users
                      </p>
                      <p className="text-sm font-semibold text-indigo-600">
                        {activeUsers}
                      </p>
                    </div>
                    <div className="text-center">
                      <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-500">
                        Last Update
                      </p>
                      <p className="text-sm font-semibold text-purple-600">
                        Just now
                      </p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-500">
                        Performance
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        Optimal
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      
    </div>
  );
}




 // // 🔹 Fetch active users
  // const fetchActiveUsers = async () => {
  //   try {
  //     const res = await fetch("/api/auth/activeUser");
  //     const data = await res.json();
  //     if (res.ok) setActiveUsers(data.activeUsers);
  //   } catch (err) {
  //     console.error("Failed to fetch active users:", err);
  //   }
  // };