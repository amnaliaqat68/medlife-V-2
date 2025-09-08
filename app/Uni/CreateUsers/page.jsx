"use client";
import React, { useState, useEffect } from "react";
import { FileText, User, Phone, MapPin } from "lucide-react";
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

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/auth/getDSMusers", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
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
      <div className="text-center mb-6">
        <section className="relative w-full h-[70px] md:h-[70px] rounded-md flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-900 rounded-md"></div>
          <div className="relative z-10 flex items-center space-x-4">
            <h1 className="text-2xl  font-bold text-white">
             USERS LIST
            </h1>
          </div>
        </section>
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

          <div className="overflow-x-auto">
            <Table className="border border-gray-200 rounded-lg">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="px-4 py-2">Name</TableHead>
                  <TableHead className="px-4 py-2">Email</TableHead>
                  <TableHead className="px-4 py-2">Phone</TableHead>
                  <TableHead className="px-4 py-2">Designation</TableHead>
                  <TableHead className="px-4 py-2">Area</TableHead>
                  <TableHead className="px-4 py-2">Role</TableHead>
                  <TableHead className="px-4 py-2 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell className="px-4 py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">{user._id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2">{user.email}</TableCell>
                      <TableCell className="px-4 py-2">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user.phone}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {user.designation}
                      </TableCell>
                      <TableCell className="px-4 py-2 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {user.area}
                      </TableCell>
                      <TableCell className="px-4 py-2">{user.role}</TableCell>
                      <TableCell className="px-4 py-2 text-center">
                        <Button
                          onClick={() => deleteUser(user._id)}
                          variant="outline"
                          size="sm"
                          className="hover:bg-red-600 hover:text-white"
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
