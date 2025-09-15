"use client";

import {useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";


export default function AddUserpage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    designation: "",
    area: "",
    role: "SM",
  });

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...form,
    role: form.designation.toLowerCase(), 
  };

  try {
    const res = await fetch("/api/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
       credentials: "include",
    });

    const data = await res.json();

    if (res.status === 201) {
      toast.success("User registered successfully!");
      setForm({
        name: "",
        phone: "",
        email: "",
        group:"",
        password: "",
        designation: "",
        area: "",
       
      });
    } else {
      toast.error(data.error || "Something went wrong");
    }
  } catch (err) {
    console.error(err.message);
    toast.error("Error submitting form");
  }
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
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Area
            </label>
            <select
              name="area"
              id="area"
              value={form.area}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all bg-gray-50 text-sm"
            >
              <option value="">Select Area</option>
              <option value="multan">Multan</option>
              <option value="faisalabad">Faisalabad</option>
              <option value="karachi">Karachi</option>
              <option value="lahore">Lahore</option>
              <option value="abbottabad">Abbottabad</option>
              <option value="sheikhupura">Sheikhupura</option>
              <option value="kasur">Kasur</option>
              <option value="dgk">DGK</option>
              <option value="jampur">Jampur</option>
              <option value="layyah">Layyah</option>
              <option value="ryk">RYK</option>
              <option value="bhp">BHP</option>
              <option value="khanewal">Khanewal</option>
              <option value="sargodha">Sargodha</option>
              <option value="chiniot">Chiniot</option>
              <option value="peshawar">Peshawar</option>
              <option value="charsadda">Charsadda</option>
              <option value="mardan">Mardan</option>
              <option value="nowshera">Nowshera</option>
              <option value="swat">Swat</option>
              <option value="sahiwal">Sahiwal</option>
              <option value="timergara">Timergara</option>
              <option value="burewala">Burewala</option>
              <option value="bhakkar">Bhakkar</option>
              <option value="jhang">Jhang</option>
              <option value="toba">Toba</option>
              <option value="gojra">Gojra</option>
              <option value="gujranwala">Gujranwala</option>
              <option value="sialkot">Sialkot</option>
            </select>
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
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              required
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