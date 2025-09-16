"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle } from "lucide-react";

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

  // ✅ Decision Handler
  // const handleDecision = async (csrId, status) => {
  //   try {
  //     setApprovingCSR(csrId);

  //     const res = await fetch("/api/csrInfo/updateCSR", {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ csrId, role: userRole, status }),
  //     });

  //     const updated = await res.json();
  //     if (!res.ok) {
  //       toast.error(updated.message || "Failed to update CSR");
  //       return;
  //     }

  //     toast.success(updated.message);

  //     if (status === "approved") {
  //       setApprovedCSRIds((prev) => [...prev, csrId]);
  //     } else if (status === "rejected") {
  //       setCsrList((prevList) => prevList.filter((csr) => csr._id !== csrId));
  //     }
  //   } catch (error) {
  //     console.error("Error updating CSR:", error);
  //     toast.error("An error occurred. Try again.");
  //   } finally {
  //     setApprovingCSR(null);
  //   }
  // };

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
      setCsrList(data);
    };

    if (userRole) {
      fetchCSR();
    }
  }, [userRole]);

  return (
    <div className="min-h-screen w-full bg-blue-50 rounded-md">
      <div className="relative bg-blue-900 rounded-2xl p-6  shadow flex items-center justify-evenly overflow-hidden">
        <div className="absolute left-2 bottom-0 w-40 h-40">
          <img
            src="https://images.unsplash.com/vector-1751489957595-83d3e9fd5102?w=600&auto=format&fit=crop&q=60"
            alt="Grass"
            className="w-28 h-28 object-contain mt-14"
          />
        </div>

        <div className="relative z-10 text-white max-w-md ">
          <h2 className="text-2xl font-bold mb-2">REVIEW & APPROVE CSRs</h2>
          <p className="text-indigo-100 mb-4"></p>
        </div>

        <div className="absolute right-4 bottom-0 w-40 h-40">
          <img
            src="/csrform.png"
            alt="Doctors"
            className="w-full h-full object-contain mt-6"
          />
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
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 rounded-md">
                      {csrList.map((csr) => (
                        <div
                          key={csr._id}
                          className="rounded-xl border bg-white shadow hover:shadow-lg transition p-5 flex flex-col"
                        >
                          {/* Header */}
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {csr.doctorId?.name || "Unknown Doctor"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Created by: {csr.creatorId?.name || "N/A"}
                            </p>
                          </div>

                          {/* Info */}
                          <p className="mb-4 text-sm">
                            <span className="font-medium text-gray-700">
                              Commitment:
                            </span>{" "}
                            <span className="text-blue-600 font-semibold">
                              {csr.Business?.[0]?.exactCost || 0}
                            </span>
                          </p>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {/* {approvedCSRIds.includes(csr._id) ? (
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
                            )} */}

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
            <div className="bg-white w-[85%] h-[90%] overflow-y-auto rounded-xl shadow-xl p-6 relative">
              {/* Sticky Header */}
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white p-4 border-b z-10">
                <div className="text-xs font-semibold">
                  <p>CSR #</p>
                  <p>{selectedCSR.csrNumber}</p>
                </div>
                <h1 className="text-lg font-bold uppercase">
                  Customer Service Request
                </h1>
                <div className="flex gap-2">
                  <Button
                    onClick={() => printRef.current && handlePrint()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Print
                  </Button>
                  <Button
                    onClick={() => setSelectedCSR(null)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Detail Content */}
              <div
                ref={printRef}
                className="bg-white p-6 max-w-[210mm] mx-auto text-sm"
              >
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
                    {selectedCSR.creatorId?.district|| "N/A"}
                  </p>
                  <p>
                    <strong> FE/MIO/SMIO:</strong>{" "}
                    {selectedCSR.filledBy || "N/A"}
                  </p>
                  <p>
                    <strong>Doctor:</strong>{" "}
                    {selectedCSR.doctorId?.name || "N/A"}
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
                    <strong>Brick:</strong>{" "}
                    {selectedCSR.doctorId?.brick || "N/A"}
                  </p>
                  <p>
                    <strong>Group:</strong>{" "}
                    {selectedCSR.doctorId?.group || "N/A"}
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
                              <td className="p-1 border">
                                Exp. Total Business
                              </td>
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
                    <h2 className="font-semibold text-sm mb-2">
                      Ledger Summary
                    </h2>
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
                          length: Math.ceil(
                            selectedCSR.ledgerSummary.length / 2
                          ),
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
                                {first?.sale || ""}
                              </td>
                              <td className="border text-[9px] p-1">
                                {second?.month || ""}
                              </td>
                              <td className="border text-[9px] p-1">
                                {second?.sale || ""}
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
                              <CheckCircle
                                className="text-green-500"
                                size={18}
                              />
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
      </main>
    </div>
  );
};

export default DecisionPage;
