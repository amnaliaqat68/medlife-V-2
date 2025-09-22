"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Edit,
  FileText,
  Loader2,
} from "lucide-react";
import AddDoctorForm from "../addDoctors/page";

export default function DoctorManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch doctors from API
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/doctorsManage/getDoctors", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error("API did not return an array", data);
        setDoctors([]);
        return;
      }

      if (res.ok) {
        setDoctors(data);
        setError("");
      } else {
        setError(data.error || "Failed to fetch doctors");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/doctorsManage/DeleteDoc/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Doctor deleted successfully");
        fetchDoctors();
      } else {
        const error = await res.json();
        toast.error(error.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting doctor");
    }
  };
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/userinfo");
      const data = await res.json();
      if (res.ok && data.user?.role) {
        setUserRole(data.user.role);
      } else {
        console.error("Failed to get user role");
      }
    }

    fetchUser();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "potential":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-800 rounded-2xl p-6 mb-6 overflow-hidden">
        {/* Medical background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4">
            <User className="w-16 h-16 text-white" />
          </div>
          <div className="absolute top-8 right-8">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <div className="absolute bottom-4 left-1/4">
            <Phone className="w-14 h-14 text-white" />
          </div>
          <div className="absolute bottom-8 right-1/4">
            <Mail className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold mb-3">
            Healthcare Providers Database
          </h1>
          <p className="text-purple-100 text-lg leading-relaxed max-w-2xl">
            Comprehensive directory of medical professionals, specialists, and
            healthcare providers with detailed profiles, contact information,
            and practice management tools.
          </p>
        </div>
      </div>
      {/* Doctor Database Header */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Healthcare Providers
                </h2>
                <p className="text-sm text-gray-600">
                  Manage medical professionals and specialists
                </p>
              </div>
            </div>

            {/* Search + Add Doctor */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="flex items-center border-2 border-gray-200 rounded-lg px-3 py-2 bg-white focus-within:border-purple-500 transition-colors">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <Input
                  placeholder="Search doctors, specialties, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none focus:ring-0 text-sm w-full sm:w-64 bg-transparent placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-2">
                {["admin", "gm"].includes(userRole) && (
                  <Button
                    onClick={() => setShowDrawer(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Add Doctor
                  </Button>
                )}
                <Badge className="bg-purple-100 text-purple-800 font-bold">
                  {filteredDoctors.length} Doctors
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Doctors Table */}
        <div className="overflow-x-auto border-t max-w-full">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading doctors database...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-red-600">
                <p className="text-lg font-semibold">Error loading doctors</p>
                <p className="text-sm">{error}</p>
                <Button
                  onClick={fetchDoctors}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead
                    className="px-3 py-3 font-semibold text-gray-700 text-sm text-center"
                    style={{ width: "60px" }}
                  >
                    #
                  </TableHead>
                  <TableHead
                    className="px-3 py-3 font-semibold text-gray-700 text-sm"
                    style={{ width: "180px" }}
                  >
                    Doctor
                  </TableHead>
                  <TableHead
                    className="px-3 py-3 font-semibold text-gray-700 text-sm"
                    style={{ width: "120px" }}
                  >
                    Speciality
                  </TableHead>
                  <TableHead
                    className="px-3 py-3 font-semibold text-gray-700 text-sm"
                    style={{ width: "100px" }}
                  >
                    District
                  </TableHead>
                  <TableHead
                    className="px-3 py-3 font-semibold text-gray-700 text-sm"
                    style={{ width: "140px" }}
                  >
                    Contact
                  </TableHead>
                  <TableHead
                    className="hidden lg:table-cell px-3 py-3 font-semibold text-gray-700 text-sm"
                    style={{ width: "80px" }}
                  >
                    Group
                  </TableHead>
                  <TableHead
                    className="hidden xl:table-cell px-3 py-3 font-semibold text-gray-700 text-sm"
                    style={{ width: "180px" }}
                  >
                    Address
                  </TableHead>
                  <TableHead
                    className="hidden xl:table-cell px-3 py-3 font-semibold text-gray-700 text-sm text-right"
                    style={{ width: "120px" }}
                  >
                    Investment
                  </TableHead>
                  <TableHead
                    className="hidden xl:table-cell px-3 py-3 font-semibold text-gray-700 text-sm text-center"
                    style={{ width: "80px" }}
                  >
                    Status
                  </TableHead>
                  <TableHead
                    className="px-3 py-3 font-semibold text-gray-700 text-sm text-center"
                    style={{ width: "140px" }}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredDoctors.map((doctor, idx) => (
                  <TableRow
                    key={doctor._id}
                    className={`transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-purple-50`}
                  >
                    {/* Serial Number */}
                    <TableCell
                      className="px-3 py-3 text-center"
                      style={{ width: "60px" }}
                    >
                      <span className="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold mx-auto">
                        {doctor.Number || `${idx + 1}`}
                      </span>
                    </TableCell>

                    {/* Doctor */}
                    <TableCell className="px-3 py-3" style={{ width: "180px" }}>
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-gray-900 truncate">
                          {doctor.name}
                        </p>
                        <p className="text-xs text-gray-500 font-medium truncate">
                          {doctor.qualification || "Medical Professional"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Speciality */}
                    <TableCell className="px-3 py-3" style={{ width: "120px" }}>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {doctor.speciality}
                        </span>
                      </div>
                    </TableCell>

                    {/* District */}
                    <TableCell className="px-3 py-3" style={{ width: "100px" }}>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {doctor.district}
                      </span>
                    </TableCell>

                    {/* Contact */}
                    <TableCell className="px-3 py-3" style={{ width: "140px" }}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-700 truncate">
                            {doctor.contact}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-500 truncate">
                            {doctor.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Group */}
                    <TableCell
                      className="hidden lg:table-cell px-3 py-3"
                      style={{ width: "80px" }}
                    >
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {doctor.group}
                      </span>
                    </TableCell>

                    {/* Address */}
                    <TableCell
                      className="hidden xl:table-cell px-3 py-3"
                      style={{ width: "180px" }}
                    >
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-600 leading-tight break-words max-h-12 overflow-hidden">
                          {doctor.address}
                        </div>
                      </div>
                    </TableCell>

                    {/* Investment */}
                    <TableCell
                      className="hidden xl:table-cell px-3 py-3 text-right"
                      style={{ width: "120px" }}
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {doctor.investmentLastYear
                            ? `₨ ${Number(
                                doctor.investmentLastYear
                              ).toLocaleString()}`
                            : "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">Last Year</p>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell
                      className="hidden xl:table-cell px-3 py-3 text-center"
                      style={{ width: "80px" }}
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          doctor.status
                        )}`}
                      >
                        {doctor.status}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      className="px-3 py-3 text-center"
                      style={{ width: "140px" }}
                    >
                      <div className="flex justify-center gap-2">
                        {["admin", "gm"].includes(userRole) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(doctor._id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-3 py-1 text-xs rounded-lg"
                          >
                            Delete
                          </Button>
                        )}
                        {["admin", "gm"].includes(userRole) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingDoc(doctor);
                            setShowDrawer(true);
                          }}
                          className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 px-3 py-1 text-xs rounded-lg"
                        >
                          Edit
                        </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {/* Drawer for Add/Edit */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="relative ml-auto w-full max-w-xl h-full bg-white shadow-xl z-50 p-6 overflow-y-auto">
            <button
              onClick={() => {
                setShowDrawer(false);
                setEditingDoc(null);
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ✖
            </button>
            <AddDoctorForm
              doctor={editingDoc}
              onSuccess={() => {
                setShowDrawer(false);
                setEditingDoc(null);
                fetchDoctors();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
