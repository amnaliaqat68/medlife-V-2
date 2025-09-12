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
import { Loader2 } from "lucide-react";
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
    <div className=" space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="relative bg-blue-900 rounded-2xl p-4 mb-4 shadow flex items-center justify-evenly overflow-hidden">
          <div className="relative z-10 text-white max-w-md ">
            <h2 className="text-2xl font-bold mb-2">CSR REPORTS</h2>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Doctor Name */}
            <div>
              <Label htmlFor="name">Doctor Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter doctor name"
              />
            </div>

            {/* District */}
            <div>
              <Label>District</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Multan",
                    "Faisalabad",
                    "Karachi",
                    "Lahore",
                    "Abbottabad",
                    "Sheikhupura",
                    "Kasur",
                    "DGK",
                    "Jampur",
                    "Layyah",
                    "RYK",
                    "BHP",
                    "Khanewal",
                    "Sargodha",
                    "Chiniot",
                    "Peshawar",
                    "Charsadda",
                    "Mardan",
                    "Nowshera",
                    "Swat",
                    "Sahiwal",
                    "Timergara",
                    "Burewala",
                    "Bhakkar",
                    "Jhang",
                    "Toba",
                    "Gojra",
                    "Gujranwala",
                    "Sialkot",
                  ].map((city) => (
                    <SelectItem
                      key={city.toLowerCase()}
                      value={city.toLowerCase()}
                    >
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate">From Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="endDate">To Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Search
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
