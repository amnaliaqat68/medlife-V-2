"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Search,
  CheckCircle,
  FileText,
  Users,
  TrendingUp,
  User,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Edit,
  Loader2,
  Activity,
} from "lucide-react";

// ✅ Component
const DecisionPage = () => {
  const [csrList, setCsrList] = useState([]);
  const [selectedCSR, setSelectedCSR] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [approvedCSRIds, setApprovedCSRIds] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [approvingCSR, setApprovingCSR] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedCSR ? `CSR-${selectedCSR.csrNumber}` : "CSR-Form",
  });

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/userinfo");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setUserRole(data.user?.role); // ✅ actual role
      }
    }
    fetchUser();
  }, []);

  const handleDecision = async (csrId, status) => {
    try {
      setApprovingCSR(csrId);

      const res = await fetch("/api/csrInfo/updateCSR", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csrId, role: userRole, status }),
      });

      const updated = await res.json();
      if (!res.ok) {
        toast.error(updated.message || "Failed to update CSR");
        return;
      }

      toast.success(updated.message);

      // ✅ Update csrList state so UI reflects new status
      setCsrList((prevList) =>
        prevList.map((csr) =>
          csr._id === csrId ? { ...csr, [`${userRole}Status`]: status } : csr
        )
      );

      if (status === "approved") {
        setApprovedCSRIds((prev) => [...prev, csrId]);
      } else if (status === "rejected") {
        setCsrList((prevList) => prevList.filter((csr) => csr._id !== csrId));
      }
    } catch (error) {
      console.error("Error updating CSR:", error);
      toast.error("An error occurred. Try again.");
    } finally {
      setApprovingCSR(null);
    }
  };

  useEffect(() => {
    const fetchCSR = async () => {
      let endpoint = "";

      if (userRole === "sm") {
        endpoint = "/api/csrInfo/getCSR";
      } else if (userRole === "gm") {
        endpoint = "/api/csrInfo/getGMCSR";
      }

      if (!endpoint) return;

      const res = await fetch(endpoint);
      const data = await res.json();
      if (res.ok) {
        let filtered = [];

        if (userRole === "sm") {
          // Show only pending & submitted by DSM, exclude approved
          filtered = data.filter(
            (csr) => csr.smStatus === "pending" && csr.creatorId.role === "dsm"
          );
        } else if (userRole === "gm") {
          // Show only those approved by SM but still pending for GM
          filtered = data.filter(
            (csr) => csr.smStatus === "approved" && csr.gmStatus === "pending"
          );
        }
        setCsrList(filtered);
      }
      // setCsrList(data);
    };

    if (userRole) {
      fetchCSR();
    }
  }, [userRole]);

  return (
    <div className="min-h-screen w-full bg-blue-50 rounded-md">
      <div className="relative bg-gradient-to-r from-green-900 via-emerald-800 to-teal-800 rounded-2xl p-6 mb-6 overflow-hidden">
        {/* Medical background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <div className="absolute top-8 right-8">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <div className="absolute bottom-4 left-1/4">
            <Activity className="w-14 h-14 text-white" />
          </div>
          <div className="absolute bottom-8 right-1/4">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold mb-3">Approved CSR Management</h1>
          <p className="text-green-100 text-lg leading-relaxed max-w-2xl">
            Review and manage approved Customer Service Requests with
            comprehensive tracking, execution workflows, and detailed analytics
            for healthcare service delivery.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-6 py-2 rounded-md">
        <Tabs defaultValue="csrs" className="space-y-6 rounded-md">
          <TabsContent value="csrs">
            <Tabs defaultValue="approvals" className="space-y-4">
              {/* ✅ Approvals Section */}
              <TabsContent value="approvals">
                <section className="mt-6">
                  {csrList.length === 0 ? (
                    <div className="flex justify-center items-center py-16">
                      <p className="text-gray-500 text-lg">
                        No CSR available for review.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {csrList.map((csr) => (
                        <div
                          key={csr._id}
                          className="relative overflow-hidden bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group rounded-2xl"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-400/5 to-teal-500/10"></div>
                          <div className="p-6 relative">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                <CheckCircle className="w-6 h-6 text-white" />
                              </div>
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                Approved
                              </span>
                            </div>
                            {/* Doctor Info */}
                            <div className="space-y-2 mb-4">
                              <h3 className="text-xl font-bold text-gray-800">
                                {csr.doctorId?.name || "N/A"}
                              </h3>
                              <p className="text-sm text-gray-500 font-medium">
                                {csr.doctorId?.speciality || "General Practice"}
                              </p>
                            </div>
                            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                              <p className="text-xs text-gray-500 mb-1">
                                Created by
                              </p>
                              <p className="text-sm font-semibold text-gray-700">
                                {csr.creatorId?.name || "N/A"}
                              </p>
                            </div>

                            {/* Business Value */}
                            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                              <p className="text-xs font-medium text-blue-600 mb-1">
                                Activity Cost
                              </p>
                              <p className="text-lg font-bold text-blue-900">
                                ₨{" "}
                                {csr.Business?.[0]?.exactCost?.toLocaleString() ||
                                  0}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {csr[`${userRole}Status`] === "approved" ? (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                  ✅ Approved
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled={approvingCSR === csr._id}
                                  onClick={() =>
                                    handleDecision(csr._id, "approved")
                                  }
                                  className="bg-green-600 hover:bg-green-700 text-black rounded-md"
                                >
                                  {approvingCSR === csr._id
                                    ? "Approving..."
                                    : "Approve"}
                                </Button>
                              )}

                              <Button
                                size="sm"
                                disabled={approvingCSR === csr._id}
                                onClick={() =>
                                  handleDecision(csr._id, "rejected")
                                }
                                className="bg-red-600 hover:bg-green-400 text-black rounded-md shadow-2xl"
                              >
                                Reject
                              </Button>

                              <Button
                                size="sm"
                                onClick={() => setSelectedCSR(csr)}
                                className="bg-white text-black rounded-md border-2 border-black"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* ✅ CSR Detail Modal */}
        {selectedCSR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-5xl h-[90%] overflow-y-auto rounded-lg shadow-lg p-4 relative">
              {/* Header Buttons */}
              <div className="flex justify-between items-center sticky top-0 shadow-sm bg-white p-2 z-10">
                <div className="text-xs  font-semibold text-gray-600">
                  <p className="uppercase">CSR #</p>
                  <p className="text-lg font-bold">{selectedCSR.csrNumber}</p>
                </div>
                <div className="text-lg font-bold">
                  <h1 className="text-xl font-bold uppercase text-gray-800 tracking-wide">
                    Customer Service Request
                  </h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (printRef.current) handlePrint();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md shadow"
                  >
                    Print
                  </Button>
                  <Button
                    onClick={() => setSelectedCSR(null)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md shadow"
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div
                ref={printRef}
                className="bg-white p-3 max-w-[250mm] mx-auto text-[12px]"
              >
                {/* Print-Only Header */}
                <div className="hidden print:flex ml-10 mb-4 border-b pb-2">
                  {/* Left: CSR Number */}
                  <div className="text-xs font-bold text-gray-700">
                    <p>CSR # {selectedCSR.csrNumber}</p>
                  </div>

                  {/* Center: Title */}
                  <div className="text-lg font-bold text-center uppercase flex-1">
                    Customer Service Request
                  </div>

                  {/* Right: Logo */}
                  <div className="flex justify-end">
                    <img
                      src="/Medlife logo.png"
                      alt="Company Logo"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                </div>

                <div className="grid print:ml-4 print:mx-auto print:w-[700px] print:mr-4 md:grid-cols-3 gap-2 border print:grid-cols-3 rounded-lg p-2 shadow-sm">
                  <p className="text-[12px]">
                    <strong>Submitted By:</strong>{" "}
                    {selectedCSR.creatorId?.name || "N/A"}
                  </p>
                  <p className="text-[12px]">
                    <strong>District:</strong>{" "}
                    {selectedCSR.creatorId?.district || "N/A"}
                  </p>
                  <p className="text-[12px]">
                    <strong> FE/MIO/SMIO:</strong>{" "}
                    {selectedCSR.filledBy || "N/A"}
                  </p>
                  <p className="text-[12px]">
                    <strong>Doctor:</strong>{" "}
                    {selectedCSR.doctorId?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Qualification:</strong>{" "}
                    {selectedCSR.doctorId?.qualification || "N/A"}
                  </p>
                  <p className="text-[12px]">
                    <strong>Designation:</strong>{" "}
                    {selectedCSR.doctorId?.designation || "N/A"}
                  </p>
                  <p>
                    <strong>Speciality:</strong>{" "}
                    {selectedCSR.doctorId?.speciality || "N/A"}
                  </p>
                  <p className="text-[12px]">
                    <strong>District:</strong>{" "}
                    {selectedCSR.doctorId?.district || "N/A"}
                  </p>
                  <p>
                    <strong>Brick:</strong>{" "}
                    {selectedCSR.doctorId?.brick || "N/A"}
                  </p>
                  <p className="col-span-2 text-[12px]">
                    <strong>Address:</strong>{" "}
                    {selectedCSR.doctorId?.address || "N/A"}
                  </p>

                  <p className="text-[12px]">
                    <strong>Group:</strong>{" "}
                    {selectedCSR.doctorId?.group || "N/A"}
                  </p>
                  <p className="text-[12px]">
                    <strong>Activity Number:</strong>{" "}
                    {selectedCSR.activityNumber || "N/A"}
                  </p>
                  <p className="text-[12px]">
                    <strong>Patients (M/E):</strong>{" "}
                    {selectedCSR.patientsMorning || 0} /{" "}
                    {selectedCSR.patientsEvening || 0}
                  </p>
                  <p className="text-[12px]">
                  <strong>Submitted Date:</strong>
                  {selectedCSR.createdAt
                    ? new Date(selectedCSR.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
                </div>

                {/* Products */}
                {selectedCSR.products?.length > 0 && (
                  <>
                    <h2 className=" text-center font-semibold text-gray-800 mb-2 mt-2">
                      Products
                    </h2>
                    <table
                      className="w-full sm:w-[900px] print:w-[700px] 
                border text-[10px] shadow-sm 
                mx-auto "
                    >
                      <thead className="bg-gray-100 text-[8px]">
                        <tr>
                          <th className="border p-1">Product</th>
                          <th className="border p-1">Strength</th>
                          <th className="border p-1">Present</th>
                          <th className="border p-1">Expected</th>
                          <th className="border p-1">Addition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCSR.products.map((p, i) => (
                          <tr key={i}>
                            <td className="border p-1 text-[9px]">
                              {p.product}
                            </td>
                            <td className="border p-1 text-[9px]">
                              {p.strength}
                            </td>
                            <td className="border p-1 text-[9px]">
                              {p.presentUnits}
                            </td>
                            <td className="border p-1 text-[9px]">
                              {p.expectedUnits}
                            </td>
                            <td className="border p-1 text-[9px]">
                              {p.additionUnits}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold text-[9px] text-gray-600 text-center bg-gray-50">
                          <td
                            colSpan={2}
                            className="border p-1 print:p-1 print:text-[9px]"
                          >
                            Business Value
                          </td>
                          <td className="border p-1 print:p-1">
                            {selectedCSR.Business?.[0]?.businessValuePresent
                              ? Number(
                                  selectedCSR.Business?.[0]
                                    ?.businessValuePresent
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="border p-1 print:p-1">
                            {selectedCSR.Business?.[0]?.businessValueExpected
                              ? Number(
                                  selectedCSR.Business?.[0]
                                    ?.businessValueExpected
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="border p-1 print:p-1">
                            {selectedCSR.Business?.[0]?.businessValueAddition
                              ? Number(
                                  selectedCSR.Business?.[0]
                                    ?.businessValueAddition
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </>
                )}

                {/* Business Details */}

                {selectedCSR.Business?.length > 0 && (
                  <section>
                    <h2 className=" text-center font-semibold mt-2 text-gray-800 mb-2">
                      Business Details
                    </h2>
                    <div
                      className=" w-full sm:w-[900px] print:w-[700px] 
                text-[10px] shadow-sm 
                mx-auto grid  md:grid-cols-2 print:grid-cols-2 gap-4"
                    >
                      {/* Activity Info */}
                      <table className="w-full border text-[10px]">
                        <thead className="bg-gray-100 text-gray-600">
                          <tr>
                            <th
                              colSpan={2}
                              className="border px-2 py-1 text-center"
                            >
                              Activity Info
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-2 py-1">Required Date</td>
                            <td className="border px-2 py-1">
                              {selectedCSR.Business[0].requiredDate
                                ? new Date(
                                    selectedCSR.Business[0].requiredDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 py-1">Exact Cost</td>
                            <td className="border px-2 py-1">
                               {selectedCSR.Business?.[0]?.exactCost
                              ? Number(
                                  selectedCSR.Business[0].exactCost
                                ).toLocaleString("en-PK")
                              : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 py-1">By HO</td>
                            <td className="border px-2 py-1">
                              {selectedCSR.Business[0].byHo || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 py-1">
                              Items Requested
                            </td>
                            <td className="border px-2 py-1">
                              {selectedCSR.Business[0].itemRequested || "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Financial Summary */}
                      <table className="w-full border text-[10px]">
                        <thead className="bg-gray-100 text-gray-600">
                          <tr>
                            <th
                              colSpan={2}
                              className="border px-2 py-1 text-center"
                            >
                              Financial Summary
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-2 py-1">ROI%</td>
                            <td className="border px-2 py-1">
                              {selectedCSR.Business[0].roi || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 py-1">
                              Expected Total Business
                            </td>
                            <td className="border px-2 py-1">
                             {selectedCSR.Business?.[0]?.expectedTotalBusiness
                              ? Number(
                                  selectedCSR.Business[0].expectedTotalBusiness
                                ).toLocaleString("en-PK")
                              : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 py-1">
                              Business Period
                            </td>
                            <td className="border px-2 py-1">
                              {selectedCSR.Business[0].businessPeriod || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 py-1">
                              Investment Last Year
                            </td>
                            <td className="border px-2 py-1">
                               {selectedCSR.Business[0].investmentLastYear
                              ? Number(
                                  selectedCSR.Business[0].investmentLastYear
                                ).toLocaleString("en-pk")
                              : "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Chemists */}
                {selectedCSR.chemists?.length > 0 && (
                  <section>
                    <h2 className="text-center font-semibold mt-2 text-gray-800 mb-2">
                      Chemists
                    </h2>
                    <div className="overflow-x-auto">
                      <table
                        className="w-full sm:w-[900px] print:w-[700px] 
                border text-[10px] shadow-sm 
                mx-auto "
                      >
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-2 py-1">Name</th>
                            <th className="border px-2 py-1">Business Share</th>
                            <th className="border px-2 py-1">Other Doctors</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCSR.chemists.map((c, i) => (
                            <tr key={i}>
                              <td className="border px-2 py-1">
                                {c.chemistName}
                              </td>
                              <td className="border px-2 py-1">
                                {c.businessShare}
                              </td>
                              <td className="border px-2 py-1">
                                {c.otherDoctors}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
                {/* Ledger Summary */}
                {selectedCSR.ledgerSummary?.length > 0 && (
                  <section>
                    <h2 className="text-center font-semibold mt-2 text-gray-800 mb-2">
                      Ledger Summary
                    </h2>
                    <div className="">
                      <table
                        className=" w-full sm:w-[900px] print:w-[700px] 
                 text-[10px] shadow-sm 
                mx-auto "
                      >
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-2 py-1">Month</th>
                            <th className="border px-2 py-1">Sale</th>
                            <th className="border px-2 py-1">Month</th>
                            <th className="border px-2 py-1">Sale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({
                            length: Math.ceil(
                              selectedCSR.ledgerSummary.length / 2
                            ),
                          }).map((_, i) => {
                            const first = selectedCSR.ledgerSummary[i * 2];
                            const second = selectedCSR.ledgerSummary[i * 2 + 1];
                            return (
                              <tr key={i}>
                                <td className="border px-1 py-1">
                                  {first?.month || ""}
                                </td>
                                <td className="border px-1 py-1">
                                  {first?.sale
                                    ? Number(first?.sale).toLocaleString(
                                        "en-pk"
                                      )
                                    : "N/A"}
                                </td>
                                <td className="border px-1 py-1">
                                  {second?.month || ""}
                                </td>
                                <td className="border px-1 py-1">
                                  {second?.sale
                                    ? Number(second?.sale).toLocaleString(
                                        "en-pk"
                                      )
                                    : "N/A"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Instructions & Comments */}
                <section className="border-t pt-4">
                  <h2 className="text-center font-semibold text-gray-800 mb-2">
                    Instructions & Comments
                  </h2>
                  <p className="ml-7">
                    <strong>Investment Instructions:</strong>{" "}
                    {selectedCSR.investmentInstructions || "N/A"}
                  </p>
                  <p className="ml-7">
                    <strong>Comments:</strong> {selectedCSR.comments || "N/A"}
                  </p>
                </section>

                {/* Approval Signatures */}
                <section className=" print:ml-4 mt-3">
                  <h2 className="font-semibold text-gray-800 mb-2">
                    Approvals
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 text-center">
                    {["sm", "gm", "pm", "md"].map((role) => {
                      const statusKey = role + "Status"; // e.g. smStatus
                      const isApproved =
                        selectedCSR?.[statusKey] === "approved";

                      const approver = selectedCSR?.approvedBy?.[role];
                      const approverName =
                        role === "sm" || role === "gm"
                          ? approver?.name || "N/A"
                          : null;

                      return (
                        <div
                          key={role}
                          className="border rounded-lg flex flex-col items-center"
                        >
                          {isApproved && (
                            <div className="flex flex-col mt-2 items-center">
                              <div className="flex items-center ">
                                <CheckCircle
                                  className="text-green-500"
                                  size={20}
                                />
                                <span className="text-green-600 text-xs font-semibold">
                                  Approved
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Role label */}
                          <p className="mt-auto text-xs font-medium">
                            {role.toUpperCase()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
                 {selectedCSR.filePath && (
                <div
                  className="hidden print:block mt-4"
                  style={{ pageBreakBefore: "always" }}
                >
                  <h2 className="font-semibold text-sm mb-2">
                    Attached Sales Report
                  </h2>

                  {selectedCSR.filePath.endsWith(".pdf") ? (
                    <p className="text-gray-600 text-xs">
                      Please see the attached PDF file:{" "}
                      {`CSR-Attachment-${selectedCSR.csrNumber}.pdf`}
                    </p>
                  ) : (
                    <img
                      src={selectedCSR.filePath}
                      alt="Attached Report"
                      className="max-h-[1000px] w-auto border mx-auto"
                    />
                  )}
                </div>
              )}
                
              </div>
              {selectedCSR.filePath && (
                <div className="mt-4">
                  <h2 className="font-semibold text-sm mb-2">
                    Attached Sales Report
                  </h2>

                  {selectedCSR.filePath.endsWith(".pdf") ? (
                    // ✅ Download button for PDFs
                    <a
                      href={selectedCSR.filePath}
                      download={`CSR-Attachment-${selectedCSR.csrNumber}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow inline-block"
                    >
                      Download PDF
                    </a>
                  ) : (
                    // ✅ Preview images directly
                    <img
                      src={selectedCSR.filePath}
                      alt="Attached Report"
                      className="max-h-[500px] w-auto border mx-auto"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DecisionPage;
