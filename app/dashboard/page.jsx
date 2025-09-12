"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  CheckCircle,
  LayoutDashboard,
  Stethoscope,
  LogOut,
  User,
  PlusCircle,
  Clock,
} from "lucide-react";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import CSRList from "../CSRs/CSRList/page";
import DoctorManagement from "../DoctorsManage/page";
import DecisionPage from "../CSRs/DescionForCsr/page";
import Createuserpage from "../Users/CreateUsers/page";
import Completedpage from "../CSRs/AdminCompletedCsr/page";
import Approvedpage from "../CSRs/AdminApprovedCsr/page";
import Reportpage from "../FilterReport/Reports/page";
import ProfileSettings from "../Profile/page";

const UniDashboardpage = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [completed, setCompleted] = useState([]);
  const [pending, setPending] = useState([]);
  const [totalCSR, setTotalCSR] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activePage, setActivePage] = useState("overview");

  const router = useRouter();
  const pathname = usePathname();

  // Logout handler
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
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/csrInfo/getreportsCSR", {
          credentials: "include",
        });

        const data = await res.json();
        console.log("Fetched CSR Reports:", data);
        setCompleted(data);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchReports();
  }, []);

  // Fetch CSRs
  useEffect(() => {
    const fetchCSR = async () => {
      let endpoint = "";

      if (role === "sm") {
        endpoint = "/api/csrInfo/getCSR";
      } else if (role === "gm") {
        endpoint = "/api/csrInfo/getGMCSR";
      } else if (role === "admin") {
        endpoint = "/api/csrInfo/getadminCSR";
      }
      if (!endpoint) return;

      const res = await fetch(endpoint);
      const data = await res.json();
      setTotalCSR(data);
      console.log(
        "CSR data:",
        data.map((csr) => csr.adminStatus)
      );

      const pendingCSR = data.filter((csr) => {
        if (role === "sm") return csr.smStatus === "pending";
         if (role === "gm") return csr.gmStatus === "pending";
        if (role === "admin") return csr.adminStatus === "pending";
        return false;
      });
      setPending(pendingCSR);
    };

    if (role) {
      fetchCSR();
    }
  }, [role]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await fetch("/api/doctorsManage/getDoctors");
      const data = await res.json();
      if (res.ok) setDoctors(data);
    };
    fetchDoctors();
  }, []);

  // Fetch User Info
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/userinfo");
      const data = await res.json();
      console.log("API response:", data);
      if (res.ok) {
        setUser(data.user);
        setRole(data.user?.role);
        console.log("User role from API:", data.user?.role);
      }
    }
    fetchUser();
  }, []);

  // Allowed roles helper
  const hasRole = (roles) => roles.includes(role);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-teal-50 ">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r shadow-sm flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b">
          <img
            src="/Medlife logo.png"
            alt="logo"
            width={50}
            className="transition-transform hover:scale-105"
          />
          <h1 className="text-lg font-bold text-blue-950">MedLife CSR</h1>
        </div>

        {/* Profile Card */}
        <div className="p-6 border-b">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center">
              <img src="/profile.png" alt="" />
            </div>
            <h2 className="mt-3 font-semibold text-gray-800">
              {user ? user.name : "Loading..."}
            </h2>
            <p className="text-sm text-gray-500">
              {user?.email || "Loading..."}
            </p>
            <Badge
              variant="secondary"
              className="mt-2 bg-indigo-600 text-white"
            >
              {role?.toUpperCase() || "NO ROLE"}
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
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
              onClick={() => router.push("/CRSs/CreatedCSR")}
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
                activePage === "descionpage"
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
                activePage === "descionpage"
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
                activePage === "descionpage"
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
                activePage === "descionpage"
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
                Set Profile
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="p-6 border-t">
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {activePage === "overview" && (
          <>
            {/* Welcome Banner */}
            <div className="relative bg-blue-900 rounded-2xl p-6 mb-4 shadow flex items-center justify-evenly overflow-hidden">
              <div className="absolute left-2 bottom-0 w-40 h-40">
                <img
                  src="/Medlife logo.png"
                  alt="Grass"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative z-10 text-white max-w-md ">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user ? user.name : "User"}!
                </h2>
                <p className="text-indigo-100 mb-4">
                  Let’s check your health with us. Care with your health from
                  now to get more live better.
                </p>
              </div>

              <div className="absolute right-4 bottom-0 w-50 h-50">
                <img
                  src="/chatgpt.png"
                  alt="Doctors"
                  className="w-full h-full object-contain mt-4"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-md">
                <CardContent className="p-5 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total CSRs</p>
                    <p className="text-2xl font-bold">{totalCSR.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-5 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Pending Approval</p>
                    <p className="text-2xl font-bold">{pending.length}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-5 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Completed CSR</p>
                    <p className="text-2xl font-bold">{completed.length}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-5 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Doctors</p>
                    <p className="text-2xl font-bold">{doctors.length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Pages */}
        {activePage === "csrlist" && hasRole(["dsm", "sm", "gm", "admin"]) && (
          <CSRList />
        )}
        {activePage === "descionpage" && role === "sm" && <Descionpage />}
        {activePage === "descionpage" && role === "gm" && <Descionpage />}
        {activePage === "approved" && role === "admin" && <Approvedpage />}
        {activePage === "completed" && role === "admin" && <Completedpage />}
        {role === "admin" && (
          <>
            {activePage === "descionpage" && (
              <div>
                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setActivePage("approvedcsr")}
                  >
                    Approved CSR
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setActivePage("completedcsr")}
                  >
                    Completed CSR
                  </Button>
                </div>

                {/* Default Descion Page */}
              </div>
            )}

            {activePage === "approvedcsr" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Approved CSR</h2>
                <Approvedpage />
              </div>
            )}

            {activePage === "completedcsr" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Completed CSR</h2>
                <Completedpage />
              </div>
            )}
          </>
        )}

        {activePage === "doctors" && hasRole(["dsm", "sm", "gm", "admin"]) && (
          <DoctorManagement />
        )}
        {activePage === "reports" && role === "admin" && <Reportpage />}
        {activePage === "createuser" && role === "admin" && <Createuserpage />}
      </main>
    </div>
  );
};

export default UniDashboardpage;
