"use client";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import {
  CheckCircle,
  Loader2,
  FileText,
  Activity,
  TrendingUp,
} from "lucide-react";
import jsPDF from "jspdf";

const Completedpage = () => {
  const [reports, setReports] = useState([]);
  const [selectedCSR, setSelectedCSR] = useState(null);
  const [loading, setLoading] = useState(true);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedCSR ? `CSR-${selectedCSR.csrNumber}` : "CSR-Form",
  });
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/csrInfo/getreportsCSR", {
          credentials: "include",
        });

        const data = await res.json();
        console.log("Fetched CSR Reports:", data);
        setReports(data);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);
  const handleDownloadCSR = (csr) => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`CSR Report #${csr.csrNumber}`, 10, 10);

    doc.setFontSize(11);
    doc.text(`Filled By: ${csr.filledBy}`, 10, 20);
    doc.text(`Doctor: ${csr.doctorId?.name || "N/A"}`, 10, 30);
    doc.text(`District: ${csr.district || "N/A"}`, 10, 40);
    doc.text(`Activity Number: ${csr.activityNumber}`, 10, 50);
    doc.text(`Patients Morning: ${csr.patientsMorning}`, 10, 60);
    doc.text(`Patients Evening: ${csr.patientsEvening}`, 10, 70);
    doc.text(`Investment Instructions: ${csr.investmentInstructions}`, 10, 80);
    doc.text(`Comments: ${csr.comments}`, 10, 90);

    // Save the file
    doc.save(`CSR_${csr.csrNumber}.pdf`);
  };

  return (
    <div>
      <section className="mt-2">
        <section className="mt-2">
          <div className="relative bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 rounded-2xl p-6 mb-6 overflow-hidden">
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
              <h1 className="text-4xl font-bold mb-3">Completed CSR Archive</h1>
              <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
                Access and review completed Customer Service Requests with full
                execution details, performance metrics, and comprehensive
                reporting for healthcare service analysis.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading completed CSRs...</p>
              </div>
            </div>
          ) : reports.length === 0 ? (
            <p>No CSR available for review.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {reports.map((csr, index) => (
                <div
                  key={csr._id || index}
                  className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group rounded-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-indigo-400/4 to-purple-500/8"></div>
                  <div className="p-4 relative">
                    {/* Header with Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    </div>
                    {/* Doctor Info */}
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xl text-gray-900 mb-1">Doctor</p>
                      <p className="text-xs font-bold text-black truncate">
                        {csr.doctorId?.name || "N/A"}
                      </p>
                    </div>

                    {/* Executed By Info */}
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-gray-800 truncate">
                        {csr.executedBy || "N/A"}
                      </h3>
                      <p className="text-xs text-gray-500">CSR Executor</p>
                    </div>

                    {/* Execution Date */}
                    <div className="mb-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <p className="text-xs font-medium text-green-600 mb-1">
                        Executed
                      </p>
                      <p className="text-xs font-bold text-green-900">
                        {csr.executeDate
                          ? new Date(csr.executeDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    {/* Particulars */}
                    <div className="mb-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                      <p className="text-xs font-medium text-purple-600 mb-1">
                        Particulars
                      </p>
                      <p className="text-xs font-medium text-purple-900 line-clamp-1">
                        {csr.particulars || "No particulars provided"}
                      </p>
                    </div>

                    {/* Business Value */}
                    <div className="mb-3 p-2 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                      <p className="text-xs font-medium text-orange-600 mb-1">
                        Activity Cost
                      </p>
                      <p className="text-sm font-bold text-orange-900">
                        ₨ {csr.Business?.[0]?.exactCost?.toLocaleString() || 0}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownloadCSR(csr)}
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-xs py-1"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedCSR(csr)}
                        className="px-2 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-md transition-all duration-200"
                      >
                        <FileText className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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

                <div className="grid print:ml-4 print:mr-4 md:grid-cols-3 gap-2 border print:grid-cols-3 rounded-lg p-2 shadow-sm">
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
                  <p>
                    <strong> Executed By:</strong>{" "}
                    {selectedCSR.executedBy || "N/A"}
                  </p>
                  <p>
                    <strong>Execute Date: </strong>
                    {selectedCSR.executeDate
                      ? new Date(selectedCSR.executeDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong> particulars: </strong>
                    {selectedCSR.particulars || "N/A"}
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
                              {selectedCSR.Business[0].exactCost || "N/A"}
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
                              {selectedCSR.Business[0].expectedTotalBusiness ||
                                "N/A"}
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
                              {selectedCSR.Business[0].investmentLastYear ||
                                "N/A"}
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
                                  {first?.sale || "N/A"}
                                </td>
                                <td className="border px-1 py-1">
                                  {second?.month || ""}
                                </td>
                                <td className="border px-1 py-1">
                                  {second?.sale || "N/A"}
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
                              {/* {approverName && (
                                      <span className="text-[8px] text-gray-600">
                                        {approverName}
                                      </span>
                                    )} */}
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
              </div>
              {selectedCSR.filePath && (
                <div className="mt-4">
                  <h2 className="font-semibold text-sm mb-2">
                    Attached Sales Report
                  </h2>
                  {(() => {
                    const fileUrl = selectedCSR.filePath.startsWith("http")
                      ? selectedCSR.filePath
                      : selectedCSR.filePath; // ✅ already starts with /uploads/

                    if (fileUrl.endsWith(".pdf")) {
                      return (
                        <iframe
                          src={fileUrl}
                          title="Sales Report"
                          className="w-full h-[500px] border"
                        />
                      );
                    } else {
                      return (
                        <img
                          src={fileUrl}
                          alt="Attached Report"
                          className="max-h-[500px] w-auto border mx-auto"
                        />
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Completedpage;
