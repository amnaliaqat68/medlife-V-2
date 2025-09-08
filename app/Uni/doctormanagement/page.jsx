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
} from "lucide-react";
import AddDoctorForm from "../addDoctors/page";

export default function DoctorManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  // ✅ Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctorsManage/getDoctors", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setDoctors(data);
      } else {
        setError(data.error || "Failed to fetch doctors");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
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
      <div className="relative bg-blue-900 rounded-2xl p-4 mb-4 shadow flex items-center justify-evenly overflow-hidden">
        <div className="relative z-10 text-white max-w-md ">
          <h2 className="text-2xl font-bold mb-2">DOCTORS DATABASE</h2>
        </div>

        <div className="absolute right-4 bottom-0 w-40 h-40"></div>
      </div>
      {/* Doctor Database Header */}
      <div className="bg-white rounded-md shadow-sm">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
            <span className="text-lg sm:text-xl font-semibold text-gray-800">
              Doctor Database
            </span>

            {/* Search + Add Doctor */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex items-center border rounded-md px-2 w-full sm:w-64 bg-gray-50">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none focus:ring-0 text-sm w-full bg-transparent"
                />
              </div>
              {["admin", "gm"].includes(userRole) && (
                <Button
                  onClick={() => setShowDrawer(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        {/* Doctors Table */}
        <div className="overflow-x-auto border-t">
          <Table className="min-w-full text-sm">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-4 py-3 font-semibold text-gray-700">
                  Doc #
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-gray-700">
                  Doctor
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-gray-700">
                  Speciality
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-gray-700">
                  District
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-gray-700">
                  Contact
                </TableHead>
                <TableHead className="hidden lg:table-cell px-4 py-3 font-semibold text-gray-700">
                  Group
                </TableHead>
                <TableHead className="hidden xl:table-cell px-4 py-3 font-semibold text-gray-700">
                  Address
                </TableHead>
                <TableHead className="hidden xl:table-cell px-4 py-3 font-semibold text-gray-700">
                  Investment
                </TableHead>
                <TableHead className="hidden xl:table-cell px-4 py-3 font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-gray-700 text-center">
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
                  } hover:bg-indigo-50`}
                >
                  {/* Doctor */}
                  <TableCell className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {doctor.Number || `${idx + 1}`}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <p className="font-medium text-gray-900 text-[12px]">
                      {doctor.name}
                    </p>
                  </TableCell>

                  {/* Speciality */}
                  <TableCell className="px-4 py-3 text-[12px]">
                    {doctor.speciality}
                  </TableCell>

                  {/* District */}
                  <TableCell className="px-4 py-3 text-[12px]">
                    {doctor.district}
                  </TableCell>

                  {/* Contact */}
                  <TableCell className="px-4 py-3 text-[12px]">
                    <div className="flex flex-col text-xs sm:text-sm">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{doctor.contact}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Mail className="w-3 h-3 text-gray-400 text-[12px]" />
                        <span>{doctor.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Group */}
                  <TableCell className="hidden lg:table-cell px-4 py-3 text-[12px]">
                    {doctor.group}
                  </TableCell>

                  {/* Address */}
                  <TableCell className="hidden xl:table-cell px-4 py-3 text-[10px] whitespace-normal break-words max-w-[220px] text-gray-600">
                    {doctor.address}
                  </TableCell>

                  {/* Investment */}
                  <TableCell className="hidden xl:table-cell px-4 py-3 text-[12px]">
                    {doctor.investmentLastYear
                      ? `₨ ${Number(
                          doctor.investmentLastYear
                        ).toLocaleString()}`
                      : "NA"}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="hidden xl:table-cell px-4 py-3 text-[12px]">
                    <Badge className={getStatusColor(doctor.status)}>
                      {doctor.status}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3 flex justify-center gap-2">
                    {["admin", "gm"].includes(userRole) && (
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(doctor._id)}
                        className="border-gray-300 text-red-600 hover:bg-red-50 px-3 py-1 text-xs sm:text-sm"
                      >
                        Delete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingDoc(doctor);
                        setShowDrawer(true);
                      }}
                      className="border-gray-300 text-yellow-600 hover:bg-yellow-50 px-3 py-1 text-xs sm:text-sm"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

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
