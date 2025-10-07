"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

export default function AddUserpage({ user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    designation: "",
    district: [],
    role: "SM",
  });
  const areaOptions = [
    { value: "multan", label: "Multan" },
    { value: "faisalabad", label: "Faisalabad" },
    { value: "karachi", label: "Karachi" },
    { value: "lahore", label: "Lahore" },
    { value: "abbottabad", label: "Abbottabad" },
    { value: "sheikhupura", label: "Sheikhupura" },
    { value: "kasur", label: "Kasur" },
    { value: "dgk", label: "DGK" },
    { value: "jampur", label: "Jampur" },
    { value: "layyah", label: "Layyah" },
    { value: "ryk", label: "RYK" },
    { value: "bhp", label: "BHP" },
    { value: "khanewal", label: "Khanewal" },
    { value: "sargodha", label: "Sargodha" },
    { value: "chiniot", label: "Chiniot" },
    { value: "peshawar", label: "Peshawar" },
    { value: "charsadda", label: "Charsadda" },
    { value: "mardan", label: "Mardan" },
    { value: "nowshera", label: "Nowshera" },
    { value: "swat", label: "Swat" },
    { value: "sahiwal", label: "Sahiwal" },
    { value: "timergara", label: "Timergara" },
    { value: "burewala", label: "Burewala" },
    { value: "bhakkar", label: "Bhakkar" },
    { value: "jhang", label: "Jhang" },
    { value: "toba", label: "Toba" },
    { value: "gojra", label: "Gojra" },
    { value: "gujranwala", label: "Gujranwala" },
    { value: "sialkot", label: "Sialkot" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; 
  setLoading(true);

    const payload = {
      ...form,
      role: form.designation.toLowerCase(),
    };

    try {
      let res;
      if (user?._id) {
        // Editing → PATCH
        res = await fetch(`/api/UpdateUser/${user._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating → POST
        res = await fetch(`/api/auth/createUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || data.message || "Something went wrong");
        return;
      }

      // ✅ Success toast
      if (user?._id) {
        toast.success("User updated successfully!");
      } else {
        toast.success("User added successfully!");
      }
      if (typeof onSuccess === "function") {
      onSuccess(); 
    }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting user");
    }
    finally {
    setLoading(false); 
  }
  };
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",

        email: user.email || "",
        designation: user.designation || "",

        district: Array.isArray(user.district) ? user.district : [],
        group: user.group || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

  return (
    <main className="min-h-screen bg-white max-w-xl flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-full bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 text-center">
          Create New User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all bg-gray-50 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="phone"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all bg-gray-50 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
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
          <div className="mb-4">
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Designation
            </label>
            <select
              name="designation"
              id="designation"
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all bg-gray-50 text-sm"
            >
              <option value="">Select Designation</option>
              <option value="dsm">DSM</option>
              <option value="gm">GM</option>
              <option value="sm">SM</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="group"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Group
            </label>
            <select
              name="group"
              id="group"
              value={form.group}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all bg-gray-50 text-sm"
            >
              <option value="">Select Group</option>
              <option value="venus">Venus</option>
              <option value="dynamic">Dynamic</option>
              <option value="jupiter">Jupiter</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (All)
            </label>
            <Select
              options={areaOptions}
              isMulti
              value={areaOptions.filter((opt) =>
                form.district.includes(opt.value)
              )}
              onChange={(selected) => {
                if (selected.length <= 35) {
                  setForm({ ...form, district: selected.map((s) => s.value) });
                }
              }}
              className="text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password || ""}
              onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all bg-gray-50 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium shadow-sm transition-colors duration-200 text-sm"
          >
            create Account
          </button>
        </form>
      </div>
    </main>
  );
}
