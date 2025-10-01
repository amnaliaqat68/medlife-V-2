"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import CSRList from "@/app/CSRs/CSRList/page";

const SummaryPage = ({ data = [] }) => {
  const [visibleRows, setVisibleRows] = useState(500);
  const [reports, setReports] = useState([]);
  const [selectedCSR, setSelectedCSR] = useState(null);
  const router = useRouter();
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedCSR ? `CSR-${selectedCSR.csrNumber}` : "CSR-Form",
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/csrInfo/getreportsCSR", {
          credentials: "include",
        });

        const data = await res.json();
        console.log("Fetched CSR Reports:", data);
        setReports(data);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="overflow-x-auto  m-2 mt-4 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <table className="min-w-full table-auto   border border-gray-400 items-center text-center">
        <thead className="bg-blue-100 border">
          <tr>
            {[
              "Sr#",
              "Execution Date",
              "CSR-No.",
              "Doctor's Name",
              "Speciality",
              "Address",
              "Brick",
              "District",
              "Region",
              "Group",
              "Executed By",
              "Particulars",
              "Amount",
              "View",
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-2 border-b text-[14px] font-bold text-gray-700 border border-gray-400 "
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.slice(0, visibleRows).map((csr, idx) => (
            <tr key={idx} className="text-[12px] hover:bg-gray-50">
              <td className="px-2 py-2 border border-gray-300">{idx + 1}</td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.executeDate
                  ? new Date(csr.executeDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td
                className="px-2 py-2 border border-gray-300 text-blue-600 hover:underline cursor-pointer"
                onClick={() => setSelectedCSR(csr)}
              >
                {csr?.csrNumber || "N/A"}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.doctorId?.name}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.doctorId?.speciality}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.doctorId?.address}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.doctorId?.brick}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.doctorId?.district}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.doctorId?.zone}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.doctorId?.group}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.executedBy || "N/A"}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.particulars}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {csr.Business?.length > 0
                  ? Number(csr.Business[0].exactCost).toLocaleString()
                  : "N/A"}
              </td>
              <td className="px-4 py-3 w-32 text-center">
                {csr.executedFilePath ? (
                  csr.executedFilePath.endsWith(".pdf") ? (
                    <a
                      href={csr.executedFilePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline text-xs block"
                    >
                      View Execution File
                    </a>
                  ) : (
                    <img
                      src={csr.executedFilePath}
                      alt="Execution Attachment"
                      className="h-10 w-10 object-cover rounded-md mx-auto"
                    />
                  )
                ) : (
                  <span className="text-gray-400 text-xs italic block">
                    No Execution File
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-bold text-[13px]">
            <td
              colSpan={12}
              className="px-2 py-2 border border-gray-400 text-right"
            >
              Total:
            </td>
            <td className="px-2 py-2 border border-gray-400">
              {data
                .slice(0, visibleRows)
                .reduce(
                  (sum, csr) =>
                    sum +
                    (csr.Business?.length > 0
                      ? Number(csr.Business[0].exactCost)
                      : 0),
                  0
                )
                .toLocaleString()}
            </td>
            <td className="px-2 py-2 border border-gray-400"></td>
          </tr>
        </tfoot>
      </table>

      {visibleRows < data.length && (
        <div className="flex justify-center py-3">
          <Button onClick={() => setVisibleRows(visibleRows + 10)}>
            View More
          </Button>
        </div>
      )}
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
                  {selectedCSR.creatorId.name || "N/A"}
                </p>
                <p className="text-[12px]">
                  <strong>District:</strong>{" "}
                  {Array.isArray(selectedCSR.creatorId?.district)
                    ? selectedCSR.creatorId.district.join(", ")
                    : selectedCSR.creatorId?.district || "N/A"}
                </p>
                <p className="text-[12px]">
                  <strong> FE/MIO/SMIO:</strong> {selectedCSR.filledBy || "N/A"}
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
                  <strong>Doctor:</strong> {selectedCSR.doctorId?.name || "N/A"}
                </p>
                <p>
                  <strong>Qualification:</strong>
                  {selectedCSR.doctorId?.qualification || "N/A"}
                </p>
                <p className="text-[12px]">
                  <strong>Designation:</strong>
                  {selectedCSR.doctorId?.designation || "N/A"}
                </p>
                <p>
                  <strong>Speciality:</strong>
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
                            {selectedCSR.Business[0].expectedTotalBusiness ||
                              "N/A"}
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

export default SummaryPage;
