"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import SummaryPage from "../nationalSummary/page";
import { Loader2, FileText, BarChart3, Search, User, MapPin, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import Filterpage from "../fetFilter/page";

const Reportpage = () => {
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    router.push(
      `/Uni/fetFilter?district=${district}&startDate=${startDate}&endDate=${endDate}&name=${name}`
    );
  };
  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-emerald-900 via-green-800 to-teal-800 rounded-3xl p-8 mb-6 overflow-hidden shadow-2xl">
        {/* Medical Icons Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 right-8">
            <FileText className="w-24 h-24 text-white" />
          </div>
          <div className="absolute bottom-6 left-8">
            <BarChart3 className="w-20 h-20 text-white" />
          </div>
        </div>
        
        <div className="relative z-10 text-white text-center">
          <h1 className="text-4xl font-bold mb-3">Medical Reports & Analytics</h1>
          <p className="text-green-100 text-lg">Generate comprehensive CSR reports with advanced filtering options</p>
        </div>
      </div>

      {/* Enhanced Filter Card */}
      <Card className="shadow-2xl border-0 bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-xl py-2">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-gray-800 font-bold text-lg">Advanced Report Filters</h2>
              <p className="text-sm text-gray-600 font-normal">Configure your search criteria for detailed medical reports</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Doctor Name */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                Healthcare Provider
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter doctor's full name"
                  className="pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-sm"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500">Search by doctor's name or specialty</p>
            </div>

            {/* District */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                Medical District
              </Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 py-3">
                  <SelectValue placeholder="Choose healthcare district" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                  {[
                    "Multan", "Faisalabad", "Karachi", "Lahore", "Abbottabad",
                    "Sheikhupura", "Kasur", "DGK", "Jampur", "Layyah", "RYK",
                    "BHP", "Khanewal", "Sargodha", "Chiniot", "Peshawar",
                    "Charsadda", "Mardan", "Nowshera", "Swat", "Sahiwal",
                    "Timergara", "Burewala", "Bhakkar", "Jhang", "Toba",
                    "Gojra", "Gujranwala", "Sialkot"
                  ].map((city) => (
                    <SelectItem
                      key={city.toLowerCase()}
                      value={city.toLowerCase()}
                      className="py-3 px-4 hover:bg-green-50 focus:bg-green-50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {city}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Select medical service area</p>
            </div>

            {/* Start Date */}
            <div className="space-y-3">
              <Label htmlFor="startDate" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                Report Start Date
              </Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-sm"
                />
              </div>
              <p className="text-xs text-gray-500">Beginning of report period</p>
            </div>

            {/* End Date */}
            <div className="space-y-3">
              <Label htmlFor="endDate" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                Report End Date
              </Label>
              <div className="relative">
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-sm"
                />
              </div>
              <p className="text-xs text-gray-500">End of report period</p>
            </div>
          </div>

          {/* Enhanced Search Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <BarChart3 className="h-5 w-5" />
              )}
              {loading ? "Generating Report..." : "Generate Medical Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-12 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Fetching
            reports...
          </div>
        ) : reports.length > 0 ? (
          <SummaryPage data={reports} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            No reports found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportpage;