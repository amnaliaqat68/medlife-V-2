"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  // Fetch user info on load
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/userinfo");
      const data = await res.json();
      if (data.user) {
        setFormData({
          ...formData,
          name: data.user.name,
          email: data.user.email,
        });
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Profile updated!");
      setFormData((prev) => ({ ...prev, password: "" })); // clear password field
      router.push("/dashboard");
    } else {
      alert(data.error || "Update failed");
    }
  };

  return (
    <div>
      <div className="p-6 border-t w-[500px] mx-auto">
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Edit Profile</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full mb-2 p-2 border rounded"
          />

          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
