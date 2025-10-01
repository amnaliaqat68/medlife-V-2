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

export default function ProfileSettings() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
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

  // const fetchAllData = async () => {
  //   setLoading(true);

  //   try {
  //     // Fetch user info first
  //     setLoadingStates((prev) => ({ ...prev, user: true }));
  //     const userRes = await fetch("/api/auth/userinfo");
  //     const userData = await userRes.json();

  //     if (userRes.ok) {
  //       setUser(userData.user);
  //       setRole(userData.user?.role);
  //       setLoadingStates((prev) => ({ ...prev, user: false }));

  //       const userRole = userData.user?.role;

  //       // Parallel fetch of other data based on role
  //       const promises = [];

  //       // Fetch reports
  //       setLoadingStates((prev) => ({ ...prev, reports: true }));
  //       promises.push(
  //         fetch("/api/csrInfo/getreportsCSR", { credentials: "include" })
  //           .then((res) => res.json())
  //           .then((data) => {
  //             setCompleted(data);
  //             setLoadingStates((prev) => ({ ...prev, reports: false }));
  //           })
  //           .catch((err) => {
  //             console.error("Fetch reports failed", err);
  //             setLoadingStates((prev) => ({ ...prev, reports: false }));
  //           })
  //       );

  //       // Fetch CSRs based on role
  //       setLoadingStates((prev) => ({ ...prev, csr: true }));
  //       let csrEndpoint = "";
  //       if (userRole === "sm") {
  //         csrEndpoint = "/api/csrInfo/getCSR";
  //       } else if (userRole === "gm") {
  //         csrEndpoint = "/api/csrInfo/getGMCSR";
  //       } else if (userRole === "admin") {
  //         csrEndpoint = "/api/csrInfo/getadminCSR";
  //       }

  //       if (csrEndpoint) {
  //         promises.push(
  //           fetch(csrEndpoint)
  //             .then((res) => res.json())
  //             .then((data) => {
  //               setTotalCSR(data);

  //               const pendingCSR = data.filter((csr) => {
  //                 if (userRole === "sm") return csr.smStatus === "pending";
  //                 if (userRole === "gm") return csr.gmStatus === "pending";
  //                 if (userRole === "admin")
  //                   return csr.adminStatus === "pending";
  //                 return false;
  //               });
  //               setPending(pendingCSR);
  //               setLoadingStates((prev) => ({ ...prev, csr: false }));
  //             })
  //             .catch((err) => {
  //               console.error("Error fetching CSR:", err);
  //               setLoadingStates((prev) => ({ ...prev, csr: false }));
  //             })
  //         );
  //       } else {
  //         setLoadingStates((prev) => ({ ...prev, csr: false }));
  //       }

  //       // Fetch doctors
  //       setLoadingStates((prev) => ({ ...prev, doctors: true }));
  //       promises.push(
  //         fetch("/api/doctorsManage/getDoctors")
  //           .then((res) => res.json())
  //           .then((data) => {
  //             if (data) setDoctors(data);
  //             setLoadingStates((prev) => ({ ...prev, doctors: false }));
  //           })
  //           .catch((err) => {
  //             console.error("Error fetching doctors:", err);
  //             setLoadingStates((prev) => ({ ...prev, doctors: false }));
  //           })
  //       );

  //       // Wait for all promises to complete
  //       await Promise.all(promises);
  //     } else {
  //       setLoadingStates((prev) => ({ ...prev, user: false }));
  //     }
  //   } catch (err) {
  //     console.error("Error fetching user:", err);
  //     setLoadingStates((prev) => ({
  //       user: false,
  //       csr: false,
  //       doctors: false,
  //       reports: false,
  //     }));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchAllData();
  // }, []);

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
    fetchUserInfo();
    // const interval = setInterval(fetchActiveUsers, 30000);
    // return () => clearInterval(interval);
  }, []);
  const hasRole = (roles) => roles.includes(role);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden">
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
                            href="/forgot-password"
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
