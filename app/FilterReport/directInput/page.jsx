"use client";
import Select from "react-select";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";

const Inputpage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [rows, setRows] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoadingDoctors(true);
    fetch("/api/doctorsManage/getDoctors")
      .then((r) => r.json())
      .then((data) => {
        setDoctors(data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch doctors", err);
        toast.error("Failed to load doctors");
      })
      .finally(() => setLoadingDoctors(false));
  }, []);

  // Add a single doctor row (pre-filled)
  const addSelectedDoctor = () => {
    if (!selectedDoctorId) return toast.error("Choose a doctor first");
    const doc = doctors.find((d) => String(d._id) === String(selectedDoctorId));
    if (!doc) return toast.error("Selected doctor not found");
    if (rows.some((r) => String(r.doctorId) === String(doc._id))) {
      toast.info("This doctor is already added");
      setSelectedDoctorId("");
      return;
    }

    const newRow = {
      doctorId: doc._id,
      name: doc.name || "",
      speciality: doc.speciality || "",
      brick: doc.brick || "",
      address: doc.address || "",
      group: doc.group || "",
      district: doc.district || "",
      executionDate: "",
      executedBy: "",
      particulars: "",
      amount: "",
    };

    setRows((prev) => [...prev, newRow]);
    setSelectedDoctorId("");
  };

  // Bulk-add helper to quickly add many doctors (IDs array)
  const addDoctorsByIds = (ids = []) => {
    const toAdd = ids
      .map((id) => doctors.find((d) => String(d._id) === String(id)))
      .filter(Boolean)
      .filter(
        (doc) => !rows.some((r) => String(r.doctorId) === String(doc._id))
      )
      .map((doc) => ({
        doctorId: doc._id,
        name: doc.name || "",
        speciality: doc.speciality || "",
        brick: doc.brick || "",
        address: doc.address || "",
        group: doc.group || "",
        district: doc.district || "",
        executionDate: "",
        executedBy: "",
        particulars: "",
        amount: "",
      }));

    if (toAdd.length === 0) {
      toast.info("No new doctors to add");
      return;
    }
    setRows((prev) => [...prev, ...toAdd]);
  };

  // Basic per-row validation
  const validateRows = () => {
    if (!rows.length) {
      toast.error("Add at least one doctor row before submitting.");
      return false;
    }
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.executionDate) {
        toast.error(
          `Execution Date required for ${r.name || "row " + (i + 1)}`
        );
        return false;
      }
      if (!r.executedBy) {
        toast.error(`Executed By required for ${r.name}`);
        return false;
      }
      if (!r.particulars) {
        toast.error(`Particulars required for ${r.name}`);
        return false;
      }
      if (r.amount === "" || isNaN(Number(r.amount))) {
        toast.error(`Valid Amount required for ${r.name}`);
        return false;
      }
    }
    return true;
  };

  // Submit all rows to backend
  const handleSubmit = async () => {
    if (!validateRows()) return;
    setSubmitting(true);

    const payload = rows.map((r) => ({
      doctorId: r.doctorId,
      executeDate: r.executionDate,
      executedBy: r.executedBy,
      particulars: r.particulars,
      amount: Number(r.amount),
      adminStatus: "completed", // change if needed
    }));

    try {
      const res = await fetch("/api/csrInfo/bulkAdd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ entries: payload }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Server error");
      }

      const result = await res.json();
      toast.success(`Saved ${result.insertedCount || rows.length} records`);
      clearRows();
    } catch (err) {
      console.error("Bulk save failed:", err);
      toast.error("Failed to save records: " + (err.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = useMemo(
    () => rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    [rows]
  );

  const handleAddRow = () => {
    if (!selectedId) return;

    const doc = doctors.find((d) => d._id === selectedId);
    if (!doc) return;

    const exists = rows.some((r) => r.doctorId === doc._id);
    if (exists) {
      alert("Doctor already added!");
      return;
    }

    setRows([
      ...rows,
      {
        doctorId: doc._id,
        name: doc.name,
        brick: doc.brick,
        group: doc.group,
        address: doc.address,
        speciality: doc.speciality,

        executionDate: "",
        executedBy: "",
        particulars: "",
        amount: "",
      },
    ]);

    setSelectedId("");
  };

  const updateRow = (i, key, value) => {
    const updated = [...rows];
    updated[i][key] = value;
    setRows(updated);
  };

  const removeRow = (i) => {
    setRows(rows.filter((_, idx) => idx !== i));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-indigo-700">
            Direct Input — Bulk CSR
          </h1>
          <p className="text-sm text-gray-600">
            Add multiple doctors and submit final CSR rows at once.
          </p>
        </div>
      </header>

      <section className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Select Doctor
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">-- Select doctor --</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} — {d.speciality || "—"} ({d.brick || "—"})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addSelectedDoctor}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
              disabled={!selectedDoctorId}
            >
              Add
            </button>

            <button
              onClick={() =>
                addDoctorsByIds(doctors.slice(0, 20).map((d) => d._id))
              }
              className="bg-gray-100 border px-3 py-2 rounded hover:bg-gray-200 text-sm"
              title="Quick add first 20 (dev helper)"
            >
              Quick Add 20
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Tip: you can add many doctors and fill per-row fields before
          submitting.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Entries ({rows.length})</h2>
          <div className="text-sm text-gray-700">
            Total Amount: <strong>Rs. {totalAmount.toLocaleString()}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">Doctor</th>
                <th className="p-2 border">District</th>
                <th className="p-2 border">Speciality</th>
                <th className="p-2 border">Brick</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Execution Date</th>
                <th className="p-2 border">Executed By</th>
                <th className="p-2 border">Particulars</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Remove</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-4 text-center text-gray-500">
                    No rows added yet
                  </td>
                </tr>
              )}

              {rows.map((r, i) => (
                <tr key={r.doctorId} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{r.name}</td>
                  <td className="p-2 border">{r.district}</td>
                  <td className="p-2 border">{r.speciality}</td>
                  <td className="p-2 border">{r.brick}</td>
                  <td className="p-2 border">{r.address}</td>

                  <td className="p-2 border">
                    <input
                      type="date"
                      value={r.executionDate}
                      onChange={(e) =>
                        updateRow(i, "executionDate", e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="text"
                      value={r.executedBy}
                      onChange={(e) =>
                        updateRow(i, "executedBy", e.target.value)
                      }
                      placeholder="Executed by"
                      className="border rounded px-2 py-1 w-32"
                    />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="text"
                      value={r.particulars}
                      onChange={(e) =>
                        updateRow(i, "particulars", e.target.value)
                      }
                      placeholder="Particulars"
                      className="border rounded px-2 py-1 w-48"
                    />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="number"
                      min="0"
                      value={r.amount}
                      onChange={(e) => updateRow(i, "amount", e.target.value)}
                      className="border rounded px-2 py-1 w-28"
                    />
                  </td>

                  <td className="p-2 border text-center">
                    <button
                      onClick={() => removeRow(i)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting || rows.length === 0}
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Submit All"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Inputpage;
