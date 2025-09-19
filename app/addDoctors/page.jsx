"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function AddDoctorForm({ doctor, onSuccess }) {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    speciality: "",
    district: "",
    address: "",
    brick: "",
    group: "",
    zone: "",
    qualification: "",
    designation: "",
    status: "active",
    investmentLastYear: "",
    email: "",
    contact: "",
    totalValue: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (doctor) {
      setForm({
        name: doctor.name || "",
        speciality: doctor.speciality || "",
        contact: doctor.contact || "",
        email: doctor.email || "",
        designation: doctor.designation || "",
        address: doctor.address || "",
        district: doctor.district || "",
        group: doctor.group || "",
        brick: doctor.brick || "",
        zone: doctor.zone || "",
        investmentLastYear: doctor.investmentLastYear || "",
        qualification: doctor.qualification || "",
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  const payload = { ...form };
  if (!payload.email) {
    delete payload.email;
  }

    try {
      let res;
      if (doctor?._id) {
        // Editing → PATCH
        res = await fetch(`/api/doctorsManage/updateDoc/${doctor._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating → POST
        res = await fetch(`/api/doctorsManage/doctors`, {
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

      // ✅ Success handling
      
      toast.success(
        doctor ? "Doctor updated successfully!" : "Doctor added successfully!"
      );
       if (typeof onSuccess === "function") {
      onSuccess(); 
    }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting doctor");
    }
  };

  return (
    <div className="p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">
          Add New Doctor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Doctor Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Dr. Ahmad Khan"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Speciality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speciality
            </label>
            <input
              type="text"
              name="speciality"
              value={form.speciality}
              onChange={handleChange}
              required
              placeholder="e.g. Cardiologist"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              required
              placeholder="e.g. Cardiologist"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              required
              placeholder="e.g. Cardiologist"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label
              htmlFor="district"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              District
            </label>
            <select
              name="district"
              id="district"
              value={form.district}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all bg-gray-50 text-sm"
            >
              <option value="">Select district</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Adress/clinic Adress
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Full Adress..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group
            </label>
            <select
              name="group"
              id="group"
              value={form.group}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md  focus:ring-1 focus:ring-blue-200 focus:outline-none"
            >
              <option value="">Select Group</option>
              <option value="venus">Venus</option>
              <option value="dynamic">Dynamic</option>
              <option value="jupiter">Jupiter</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brick
            </label>
            <input
              type="text"
              name="brick"
              value={form.brick}
              onChange={handleChange}
              required
              placeholder="brick..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zone
            </label>
            <input
              type="text"
              name="zone"
              value={form.zone}
              onChange={handleChange}
              required
              placeholder="zone..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment last 12 Months
            </label>
            <input
              name="investmentLastYear"
              value={form.investmentLastYear}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
              placeholder="e.g. 03001234567"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. @gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 w-full text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
