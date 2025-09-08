"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, CheckCircle } from "lucide-react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const [totalCSR, settotalCSR] = useState([]);
  const [selectedCSR, setSelectedCSR] = useState(null);

  const userRole = "sm";
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedCSR ? `CSR-${selectedCSR.csrNumber}` : "CSR-Form",
  });

  useEffect(() => {
    const fetchCSR = async () => {
      const res = await fetch("/api/csrInfo/getCSR");
      const data = await res.json();
      console.log("Fetched CSR Data:", data);
      console.log("Sample CSR:", data[0]);
      setCsrList(data);
    };
    fetchCSR();
  }, []);
  useEffect(() => {
    const fetchCSR = async () => {
      const res = await fetch("/api/csrInfo/getCSR");
      const data = await res.json();
      settotalCSR(data);
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
      return "Waitning for the admin approval";
    }

    return "Pending";
  }

  return (
    <div className="space-y-6">
      <div className="relative bg-blue-900 rounded-2xl p-4 mb-4 shadow flex items-center justify-evenly overflow-hidden">
        <div className="relative z-10 text-white max-w-md ">
          <h2 className="text-2xl font-bold mb-2">
            CUSTOMER SERVICE REQUEST DATA
          </h2>
          <p className="text-indigo-100 mb-4"></p>
        </div>

        <div className="absolute right-4 bottom-0 w-40 h-40"></div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Service Requests</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search CSRs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full border rounded-lg shadow-sm">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3">
                    CSR #
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3">
                    Doctor
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3">
                    District
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3">
                    Medicine
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3">
                    Active Cost
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-sm px-4 py-3 text-center">
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
                    {/* Doctor */}
                    <TableCell className="px-4 py-3 text-[12px]">
                      <p className="font-medium text-sm text-gray-800">
                        {csr.Number || `${idx + 1}`}
                      </p>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <p className="font-medium text-[12px] text-gray-800">
                        {csr.doctorId?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {csr.doctorId?.specialization || ""}
                      </p>
                    </TableCell>

                    {/* District */}
                    <TableCell className="px-4 py-3 text-[12px] text-gray-700">
                      {csr.doctorId?.district || "N/A"}
                    </TableCell>

                    {/* Medicine */}
                    <TableCell className="px-4 py-3 text-[12px] text-gray-700 whitespace-normal break-words max-w-xs">
                      {csr.products?.length > 0 ? (
                        <div className="space-y-1">
                          {csr.products.map((product, index) => (
                            <span
                              key={index}
                              className="inline-block text-black text-[12px] font-medium  py-1 rounded-md mr-1 mb-1"
                            >
                              {product.product}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "No Products"
                      )}
                    </TableCell>

                    {/* Active Cost */}
                    <TableCell className="px-4 py-3 text-[12px] text-gray-700">
                      {csr.Business?.[0]?.exactCost
                        ? `${csr.Business[0].exactCost}`
                        : "N/A"}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3 text-[12px]">
                      <span
                        className={`px-2 py-1 rounded-full  font-medium
              ${
                getOverallStatus(csr) === "Approved"
                  ? "bg-green-100 text-green-700"
                  : getOverallStatus(csr) === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
                      >
                        {getOverallStatus(csr)}
                      </span>
                    </TableCell>

                    {/* View Button */}
                    <TableCell className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded-md"
                        onClick={() => setSelectedCSR(csr)}
                      >
                        Detail View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
                  {selectedCSR.creatorId?.area || "N/A"}
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
