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
        const res = await fetch("/api/csrInfo/getCSR");
        if (!res.ok) throw new Error("Failed to fetch CSR data");
        
        const data = await res.json();
        console.log("Fetched CSR Data:", data);
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
    const matchesSearch =
      !searchTerm || name.includes(searchTerm.toLowerCase());
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
            Comprehensive medical service request management system for tracking patient care, 
            medication requests, and healthcare provider coordination.
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
                <h2 className="text-xl font-bold text-gray-800">Medical Service Requests</h2>
                <p className="text-sm text-gray-600">Manage and track all CSR submissions</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="flex items-center border-2 border-gray-200 rounded-lg px-3 py-2 bg-white focus-within:border-blue-500 transition-colors">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <Input
                  placeholder="Search by doctor, medicine, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none focus:ring-0 text-sm w-full sm:w-64 bg-transparent placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Total:</span>
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
                    Medicine
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-32 text-right">
                    Active Cost
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-28 text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 w-32 text-center">
                    View
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

                    {/* Medicine */}
                    <TableCell className="px-4 py-3 w-56">
                      {csr.products?.length > 0 ? (
                        <div className="space-y-1">
                          {csr.products.slice(0, 2).map((product, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md mr-1 mb-1"
                            >
                              <span className="text-xs font-medium truncate max-w-32">
                                {product.product}
                              </span>
                            </div>
                          ))}
                          {csr.products.length > 2 && (
                            <div className="text-xs text-gray-500 font-medium">
                              +{csr.products.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No Products</span>
                      )}
                    </TableCell>

                    {/* Active Cost */}
                    <TableCell className="px-4 py-3 w-32 text-right">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {csr.Business?.[0]?.exactCost
                            ? `₨ ${Number(csr.Business[0].exactCost).toLocaleString()}`
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
          <div className="bg-white w-[80%] h-[90%] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            {/* Header Buttons */}
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white p-2 z-10">
              <div className="text-[10px] font-bold flex-col">
                <p>CSR #</p>
                {selectedCSR.csrNumber}
              </div>
              <div className="text-lg font-bold">
                <h1>CUSTOMER SERVICE REQUEST</h1>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (printRef.current) handlePrint();
                  }}
                  className="bg-green-600 text-white"
                >
                  Print
                </Button>
                <Button
                  onClick={() => setSelectedCSR(null)}
                  className="bg-red-600 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
            <div
              ref={printRef}
              className="bg-white p-6 max-w-[250mm] mx-auto text-sm"
            >
              {/* Print-Only Header */}
              <div className="hidden print:flex items-center justify-between mb-4 border-b pb-2">
                {/* Left: CSR Number */}
                <div className="text-xs font-bold text-gray-700">
                  <p>CSR #</p>
                  <p>{selectedCSR.csrNumber}</p>
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

              <div className="grid w-[800px] grid-cols-4 gap-6 mb-2  ">
                <p>
                  <strong>Submitted By:</strong>{" "}
                  {selectedCSR.creatorId?.name || "N/A"}
                </p>
                <p>
                  <strong>District:</strong>{" "}
                  {selectedCSR.creatorId?.district || "N/A"}
                </p>
                <p>
                  <strong> FE/MIO/SMIO:</strong> {selectedCSR.filledBy || "N/A"}
                </p>
                <p>
                  <strong>Doctor:</strong> {selectedCSR.doctorId?.name || "N/A"}
                </p>
                <p>
                  <strong>Qualification:</strong>{" "}
                  {selectedCSR.doctorId?.qualification || "N/A"}
                </p>
                <p>
                  <strong>Designation:</strong>{" "}
                  {selectedCSR.doctorId?.designation || "N/A"}
                </p>
                <p>
                  <strong>Speciality:</strong>{" "}
                  {selectedCSR.doctorId?.speciality || "N/A"}
                </p>
                <p>
                  <strong>District:</strong>{" "}
                  {selectedCSR.doctorId?.district || "N/A"}
                </p>
                <p className="col-span-2">
                  <strong>Address:</strong>{" "}
                  {selectedCSR.doctorId?.address || "N/A"}
                </p>
                <p>
                  <strong>Brick:</strong> {selectedCSR.doctorId?.brick || "N/A"}
                </p>
                <p>
                  <strong>Group:</strong> {selectedCSR.doctorId?.group || "N/A"}
                </p>
                <p className="text-[12px]">
                  <strong>Customer Type:</strong>{" "}
                  {selectedCSR.customerType || "N/A"}
                </p>
                <p className="text-[12px]">
                  <strong>Patients (M/E):</strong>{" "}
                  {selectedCSR.patientsMorning || 0} /{" "}
                  {selectedCSR.patientsEvening || 0}
                </p>
              </div>

              {/* Products */}
              {selectedCSR.products?.length > 0 && (
                <>
                  <h2 className="font-semibold text-xs mb-1">Products</h2>
                  <table className="w-full border-collapse  border mb-2 text-xs">
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
                <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2 print:mb-0">
                  {/* Heading */}
                  <h3 className="text-sm font-bold mb-1 col-span-full print:mb-0 print:text-[9px]">
                    Business Details
                  </h3>

                  {/* Business Info Table */}
                  <table className="min-w-full table-auto border-collapse border border-gray-300 text-center text-[8px] print:text-[9px]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th colSpan={2} className="p-1 border text-center">
                          Activity Info
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCSR.Business.map((business, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td className="p-1 border print:w-[100px]">
                              Required Date
                            </td>
                            <td className="p-1 border">
                              {business.requiredDate
                                ? new Date(
                                    business.requiredDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 border">Exact Cost</td>
                            <td className="p-1 border">
                              {business.exactCost
                                ? Number(business.exactCost).toLocaleString()
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 border">BY HO</td>
                            <td className="p-1 border">
                              {business.byHo || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 border">Items Requested</td>
                            <td className="p-1 border">
                              {business.itemRequested || "N/A"}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>

                  {/* Financial Summary Table */}
                  <table className="min-w-full table-auto border-collapse border border-gray-300 text-center text-[9px] print:text-[9px]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th colSpan={2} className="p-1 border text-center">
                          Financial Summary
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCSR.Business.map((business, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td className="p-1 border">ROI%</td>
                            <td className="p-1 border">
                              {business.roi || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 border">Exp. Total Business</td>
                            <td className="p-1 border">
                              {business.expectedTotalBusiness
                                ? Number(
                                    business.expectedTotalBusiness
                                  ).toLocaleString()
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 border">Business Period</td>
                            <td className="p-1 border">
                              {business.businessPeriod || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 border">
                              Investment Last 12 Months
                            </td>
                            <td className="p-1 border">
                              {business.investmentLastYear
                                ? Number(
                                    business.investmentLastYear
                                  ).toLocaleString()
                                : "N/A"}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Chemists */}
              {selectedCSR.chemists?.length > 0 && (
                <>
                  <h2 className="font-semibold text-sm mb-2">Chemists</h2>
                  <table className="w-full border-collapse border text-xs mb-6">
                    <thead className="bg-gray-100 text-[10px]">
                      <tr>
                        <th className="border p-1">Name</th>
                        <th className="border p-1">Business Share</th>
                        <th className="border p-1">Other Doctors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCSR.chemists.map((c, i) => (
                        <tr key={i}>
                          <td className="border p-1 text-[9px]">
                            {c.chemistName}
                          </td>
                          <td className="border p-1 text-[9px]">
                            {c.businessShare}
                          </td>
                          <td className="border p-1 text-[9px]">
                            {c.otherDoctors}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Ledger Summary */}
              {selectedCSR.ledgerSummary?.length > 0 && (
                <>
                  <h2 className="font-semibold text-sm mb-2">Ledger Summary</h2>
                  <table className="w-full border-collapse border text-xs mb-6">
                    <thead className="bg-gray-100 text-[10px]">
                      <tr>
                        <th className="border p-1">Month</th>
                        <th className="border p-1">Sale</th>
                        <th className="border p-1">Month</th>
                        <th className="border p-1">Sale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({
                        length: Math.ceil(selectedCSR.ledgerSummary.length / 2),
                      }).map((_, rowIndex) => {
                        const first = selectedCSR.ledgerSummary[rowIndex * 2];
                        const second =
                          selectedCSR.ledgerSummary[rowIndex * 2 + 1];
                        return (
                          <tr key={rowIndex}>
                            <td className="border text-[9px] p-1">
                              {first?.month || ""}
                            </td>
                            <td className="border text-[9px] p-1">
                              {first?.sale
                                ? Number(first.sale).toLocaleString("en-PK")
                                : "N/A"}
                            </td>
                            <td className="border text-[9px] p-1">
                              {second?.month || ""}
                            </td>
                            <td className="border text-[9px] p-1">
                              {second?.sale
                                ? Number(second.sale).toLocaleString("en-PK")
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              )}

              {/* Comments */}
              <h2 className="font-semibold text-sm mb-2">
                Instructions & Comments
              </h2>
              <p className="text-[8px]">
                <strong>Investment Instructions:</strong>{" "}
                {selectedCSR.investmentInstructions || "N/A"}
              </p>
              <p className="text-[8px]">
                <strong>Comments:</strong> {selectedCSR.comments || "N/A"}
              </p>

              {/* Approval Signatures */}
              <div className="grid grid-cols-4 gap-6 mt-8">
                {["sm", "gm", "pm", "md"].map((role) => {
                  const statusKey = role + "Status"; // e.g. smStatus
                  const isApproved = selectedCSR?.[statusKey] === "approved";

                  const approver = selectedCSR?.approvedBy?.[role];
                  const approverName =
                    role === "sm" || role === "gm"
                      ? approver?.name || "N/A"
                      : null;

                  return (
                    <div key={role} className="flex flex-col items-center">
                      {isApproved && (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center ">
                            <CheckCircle className="text-green-500" size={18} />
                            <span>Approved</span>
                          </div>
                          {approverName && (
                            <span className="text-[8px] text-gray-600">
                              {approverName}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="w-full border-b h-6 mb-2"></div>

                      {/* Role label */}
                      <p className="mt-auto text-xs font-medium">
                        {role.toUpperCase()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            {selectedCSR.filePath && (
              <div className="mt-4">
                <h2 className="font-semibold text-sm mb-2">
                  Attached Sales Report
                </h2>
                <iframe
                  src={selectedCSR.filePath}
                  title="Sales Report"
                  className="w-full h-[500px] border"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CSRList;