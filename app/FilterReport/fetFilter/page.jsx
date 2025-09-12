"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SummaryPage from "../nationalSummary/page";
import { Button } from "@/components/ui/button";
import { LogOut, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Inner component that uses useSearchParams
function FilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const district = searchParams.get("district") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const name = searchParams.get("name") || "";

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/landing-page/Home");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred during logout.");
    }
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    if (!reports.length) return;
    const worksheet = XLSX.utils.json_to_sheet(
      reports.map((csr, idx) => ({
        "Sr#": idx + 1,
        "Execution Date": csr.executeDate
          ? new Date(csr.executeDate).toLocaleDateString()
          : "N/A",
        "CSR-No.": csr?.csrNumber || "N/A",
        "Doctor's Name": csr.doctorId?.name || "N/A",
        Speciality: csr.doctorId?.speciality || "N/A",
        Address: csr.doctorId?.address || "N/A",
        Brick: csr.doctorId?.brick || "N/A",
        District: csr.doctorId?.district || "N/A",
        Region: csr.doctorId?.zone || "N/A",
        Group: csr.doctorId?.group || "N/A",
        "Executed By": csr.executedBy || "N/A",
        Particulars: csr.particulars || "N/A",
        Amount:
          csr.Business?.length > 0
            ? Number(csr.Business[0].exactCost).toLocaleString()
            : "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CSR Report");
    XLSX.writeFile(workbook, "CSR_Report.xlsx");
  };

  const logo = "/Medlife logo.png";

  // ✅ Export to PDF
  const exportToPDF = () => {
    if (!reports.length) return;

    const doc = new jsPDF();
    doc.addImage(logo, "PNG", 10, 2, 25, 15);
    doc.setFontSize(12);
    doc.text("CSR Summary Report", 70, 15);

    const now = new Date();
    const monthYear = now.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    doc.setFontSize(10);
    doc.text(`Month: ${monthYear}`, 150, 15);

    const tableColumn = [
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
    ];

    const tableRows = reports.map((csr, idx) => [
      idx + 1,
      csr.executeDate ? new Date(csr.executeDate).toLocaleDateString() : "N/A",
      csr?.csrNumber || "N/A",
      csr.doctorId?.name || "N/A",
      csr.doctorId?.speciality || "N/A",
      csr.doctorId?.address || "N/A",
      csr.doctorId?.brick || "N/A",
      csr.doctorId?.district || "N/A",
      csr.doctorId?.zone || "N/A",
      csr.doctorId?.group || "N/A",
      csr.executedBy || "N/A",
      csr.particulars || "N/A",
      csr.Business?.length > 0
        ? Number(csr.Business[0].exactCost).toLocaleString()
        : "N/A",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 5 },
    });

    doc.save("CSR_Report.pdf");
  };

  useEffect(() => {
    const fetchFilteredReports = async () => {
      setLoading(true);
      console.log("Fetching with parameters:", {
        district,
        startDate,
        endDate,
        name,
      });
      try {
        const res = await fetch(
          `/api/csrInfo/getFilteredCSR?district=${district}&startDate=${startDate}&endDate=${endDate}&name=${name}`
        );
        const data = await res.json();
        console.log("Received data:", data.length, "records");
        setReports(data);
      } catch (err) {
        console.error("Fetch failed", err);
      }
      setLoading(false);
    };

    fetchFilteredReports();
  }, [district, startDate, endDate, name]);

  return (
    <div>
      <header className="flex items-center justify-between w-full px-6 py-4 bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        {/* Left: Logo + Brand */}
        <div className="flex items-center space-x-3">
          <img
            src="/Medlife logo.png"
            alt="MedLife Logo"
            width={45}
            className="transition-transform hover:scale-105"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-900 ">
            MedLife
          </h1>
        </div>

        {/* Center: Page Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <p className="text-lg sm:text-2xl font-bold text-indigo-900">
            National Summary Report
          </p>
        </div>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center space-x-4">
          <Button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button
            onClick={exportToPDF}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : reports.length > 0 ? (
        <SummaryPage data={reports} />
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
}

// ✅ Wrap with Suspense here
export default function Filterpage() {
  return (
    <Suspense fallback={<p>Loading filters...</p>}>
      <FilterContent />
    </Suspense>
  );
}
