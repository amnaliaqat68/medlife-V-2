"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, CheckCircle, Loader2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReactToPrint } from "react-to-print";

const CSRList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [csrList, setCsrList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [selectedCSR, setSelectedCSR] = useState(null);

  const userRole = "sm";
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedCSR ? `CSR-${selectedCSR.csrNumber}` : "CSR-Form",
  });

  useEffect(() => {
    const fetchCSR = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/csrInfo/getCSR", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch CSR data");

        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error("API did not return an array", data);
          setCsrList([]);
          return;
        }
        // console.log("Fetched CSR Data:", data);
        setCsrList(data);
      } catch (error) {
        console.error("Error fetching CSR:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCSR();
  }, []);

  const filteredCSRs = csrList.filter((csr) => {
    const name = csr.doctorId?.name?.toLowerCase() || "";
    const district = csr.doctorId?.district?.toLowerCase() || "";
    const address = csr.doctorId?.address?.toLowerCase() || "";
    const matchesSearch =
      !searchTerm ||
      name.includes(searchTerm.toLowerCase()) ||
      district.includes(searchTerm.toLocaleLowerCase()) ||
      address.includes(searchTerm.toLowerCase());
    const overallStatus = getOverallStatus(csr);
    const matchesStatus =
      statusFilter === "all" || overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function getOverallStatus(csr) {
    const { smStatus, gmStatus, adminStatus } = csr;

    if ([smStatus, gmStatus, adminStatus].includes("rejected")) {
      return "Rejected";
    }

    if (adminStatus === "completed") {
      return "Completed";
    }

    if (smStatus === "approved" && gmStatus === "approved") {
      return "pending";
    }

    return "Pending";
  }

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-teal-800 rounded-2xl p-6 mb-6 overflow-hidden">
        {/* Medical background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4">
            <FileText className="w-16 h-16 text-white" />
          </div>
          <div className="absolute top-8 right-8">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute bottom-4 right-1/4">
            <Search className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold mb-3">
            Customer Service Request Database
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            Comprehensive medical service request management system for tracking
            patient care, medication requests, and healthcare provider
            coordination.
          </p>
        </div>
      </div>
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Medical Service Requests
                </h2>
                <p className="text-sm text-gray-600">
                  Manage and track all CSR submissions
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="flex items-center border-2 border-gray-200 rounded-lg px-3 py-2 bg-white focus-within:border-blue-500 transition-colors">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <Input
                  placeholder="Search by doctor, address, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none focus:ring-0 text-sm w-full sm:w-64 bg-transparent placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Total:
                </span>
                <Badge className="bg-blue-100 text-blue-800 font-bold">
                  {filteredCSRs.length} CSRs
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading CSR data...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full border rounded-lg shadow-sm">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-16 text-center">
                      #
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-48">
                      Doctor
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-32">
                      District
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-56">
                      Address
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-32 text-right">
                      Activity Cost
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-28 text-center">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-32 text-center">
                      View
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-32 text-center">
                      Attachment
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCSRs.map((csr, idx) => (
                    <TableRow
                      key={csr._id}
                      className={`transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50`}
                    >
                      {/* Serial Number */}
                      <TableCell className="px-4 py-3 w-16 text-center">
                        <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold mx-auto">
                          {csr.Number || `${idx + 1}`}
                        </span>
                      </TableCell>

                      {/* Doctor */}
                      <TableCell className="px-4 py-3 w-48">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-gray-900 truncate">
                            {csr.doctorId?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500 font-medium truncate">
                            {csr.doctorId?.speciality || "General Practice"}
                          </p>
                        </div>
                      </TableCell>

                      {/* District */}
                      <TableCell className="px-4 py-3 w-32">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {csr.doctorId?.district || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 w-32">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {csr.doctorId?.address || "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Active Cost */}
                      <TableCell className="px-4 py-3 w-32 text-right">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {csr.Business?.[0]?.exactCost
                              ? `₨ ${Number(
                                  csr.Business[0].exactCost
                                ).toLocaleString()}`
                              : "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">Total Cost</p>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-4 py-3 w-28 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            getOverallStatus(csr) === "Approved"
                              ? "bg-green-100 text-green-800"
                              : getOverallStatus(csr) === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : getOverallStatus(csr) === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getOverallStatus(csr)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 w-32 text-center">
                        {csr.filePath ? (
                          csr.filePath.endsWith(".pdf") ? (
                            <a
                              href={csr.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-xs"
                            >
                              View PDF
                            </a>
                          ) : (
                            <img
                              src={csr.filePath}
                              alt="Attachment"
                              className="h-10 w-10 object-cover rounded-md mx-auto"
                            />
                          )
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            No file
                          </span>
                        )}
                      </TableCell>

                      {/* View Button */}
                      <TableCell className="px-4 py-3 w-32 text-center">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                          onClick={() => setSelectedCSR(csr)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
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

              <div className="grid print:mx-auto print:w-[700px]  md:grid-cols-3 gap-2 border print:grid-cols-3 rounded-lg p-2 shadow-sm">
                <p className="text-[12px]">
                  <strong>Submitted By:</strong>{" "}
                  {selectedCSR.creatorId?.name || "N/A"}
                </p>
                <p className="text-[12px]">
                  <strong>District:</strong>{" "}
                  {selectedCSR.creatorId?.district || "N/A"}
                </p>
                <p className="text-[12px]">
                  <strong> FE/MIO/SMIO:</strong> {selectedCSR.filledBy || "N/A"}
                </p>
                <p className="text-[12px]">
                  <strong>Doctor:</strong> {selectedCSR.doctorId?.name || "N/A"}
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
                  <strong>Brick:</strong> {selectedCSR.doctorId?.brick || "N/A"}
                </p>
                <p className="col-span-2 text-[12px]">
                  <strong>Address:</strong>{" "}
                  {selectedCSR.doctorId?.address || "N/A"}
                </p>

                <p className="text-[12px]">
                  <strong>Group:</strong> {selectedCSR.doctorId?.group || "N/A"}
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
                  <strong>Submitted By:</strong>
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
                          <td className="border p-1 text-[9px]">{p.product}</td>
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
                                selectedCSR.Business?.[0]?.businessValuePresent
                              ).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="border p-1 print:p-1">
                          {selectedCSR.Business?.[0]?.businessValueExpected
                            ? Number(
                                selectedCSR.Business?.[0]?.businessValueExpected
                              ).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="border p-1 print:p-1">
                          {selectedCSR.Business?.[0]?.businessValueAddition
                            ? Number(
                                selectedCSR.Business?.[0]?.businessValueAddition
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
                          <td className="border px-2 py-1">Items Requested</td>
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
                          <td className="border px-2 py-1">Business Period</td>
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
                                  ? Number(first?.sale).toLocaleString("en-pk")
                                  : "N/A"}
                              </td>
                              <td className="border px-1 py-1">
                                {second?.month || ""}
                              </td>
                              <td className="border px-1 py-1">
                                {second?.sale
                                  ? Number(second?.sale).toLocaleString("en-pk")
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
              <section className="border-t pt-4 flex">
                <p className="ml-7">
                  <strong>Investment Instructions:</strong>{" "}
                  {selectedCSR.investmentInstructions || "N/A"}
                </p>
                <p className="ml-7">
                  <strong>Comments:</strong> {selectedCSR.comments || "N/A"}
                </p>
              </section>

              {/* Approval Signatures */}
              <section className=" print:ml-4 mt-1">
                <h2 className="font-semibold text-gray-800 mb-2">Approvals</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 text-center">
                  {["sm", "gm", "pm", "md"].map((role) => {
                    const statusKey = role + "Status"; // e.g. smStatus
                    const isApproved = selectedCSR?.[statusKey] === "approved";

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
    </div>
  );
};

export default CSRList;
