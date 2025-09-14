"use client";
import React, { useState, useEffect } from "react";
import { FileText, User, Phone, MapPin, Loader2, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";


const Createuserpage = () => {
  const [userRole, setUserRole] = useState("Admin");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showcreateUser, setShowcreateUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/getDSMusers", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setError("");
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/userinfo");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      }
    }

    fetchUser();
    fetchUsers();
  }, []);

  return (
    <div>
      {/* Banner/Header */}
      <div className="mb-6">
        <div className="relative bg-gradient-to-r from-indigo-900 via-blue-800 to-cyan-800 rounded-2xl p-6 mb-6 overflow-hidden">
          {/* Medical background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4">
              <User className="w-16 h-16 text-white" />
            </div>
            <div className="absolute top-8 right-8">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <div className="absolute bottom-4 left-1/4">
              <Users className="w-14 h-14 text-white" />
            </div>
            <div className="absolute bottom-8 right-1/4">
              <Activity className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="relative z-10 text-white">
            <h1 className="text-4xl font-bold mb-3">
              User Management System
            </h1>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl">
              Comprehensive user administration and access control system for managing healthcare 
              professionals, administrators, and system users with role-based permissions.
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {userRole === "Admin" && (
              <Button
                onClick={() => setShowcreateUser(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Users +
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full border rounded-lg shadow-sm">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="px-4 py-3 font-semibold text-gray-700 text-sm w-16 text-center">#</TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-gray-700 text-sm w-48">Name</TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-gray-700 text-sm w-56">Email</TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-gray-700 text-sm w-32">Phone</TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-gray-700 text-sm w-32">Designation</TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-gray-700 text-sm w-28">Area</TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-gray-700 text-sm w-24 text-center">Role</TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-gray-700 text-sm w-28 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user, idx) => (
                    <TableRow 
                      key={user._id} 
                      className={`transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                    >
                      {/* Serial Number */}
                      <TableCell className="px-4 py-3 w-16 text-center">
                        <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold mx-auto">
                          {idx + 1}
                        </span>
                      </TableCell>

                      {/* Name */}
                      <TableCell className="px-4 py-3 w-48">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">ID: {user._id.slice(-6)}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="px-4 py-3 w-56">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {user.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* Phone */}
                      <TableCell className="px-4 py-3 w-32">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {user.phone}
                          </span>
                        </div>
                      </TableCell>

                      {/* Designation */}
                      <TableCell className="px-4 py-3 w-32">
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {user.designation}
                        </span>
                      </TableCell>

                      {/* Area */}
                      <TableCell className="px-4 py-3 w-28">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {user.area}
                          </span>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell className="px-4 py-3 w-24 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {user.role}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-3 w-28 text-center">
                        <Button
                          onClick={() => deleteUser(user._id)}
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-3 py-1 text-xs rounded-lg"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No users found.
                    </TableCell>
                  </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slide-over Create User Panel */}
      {showcreateUser && (
        <div className="fixed inset-0 z-50 flex">
          <div className="relative ml-auto w-full max-w-xl h-full bg-white shadow-xl z-50 p-6 overflow-y-auto">
            <button
              onClick={() => setShowcreateUser(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ✖
            </button>
            <CreateUserpage />
          </div>
        </div>
      )}
    </div>
  );
};

export default Createuserpage;
