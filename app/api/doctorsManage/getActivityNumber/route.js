// pages/api/csrInfo/getNextActivityNumber.js
import connectDB from "@/app/config/db";
import CSRfom from "@/app/model/CSRfom";

export async function GET(req) {
  await connectDB();

  try {
    // Fetch all completed CSRs
    const data = await CSRfom.find({ adminStatus: "completed" }).lean();

    // Map to track max activity number per doctor
    const doctorActivityMap = {};

    data.forEach((csr) => {
      if (!csr.doctorId) return;

      if (!doctorActivityMap[csr.doctorId]) {
        doctorActivityMap[csr.doctorId] = csr.activityNumber || 0;
      } else {
        doctorActivityMap[csr.doctorId] = Math.max(
          doctorActivityMap[csr.doctorId],
          csr.activityNumber || 0
        );
      }
    });

    // Return map with next activity number for each doctor
    const nextActivityNumbers = {};
    for (let doctorId in doctorActivityMap) {
      nextActivityNumbers[doctorId] = doctorActivityMap[doctorId] + 1;
    }

    return new Response(JSON.stringify(nextActivityNumbers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error fetching activity numbers", { status: 500 });
  }
}


 // useEffect(() => {
  //   const fetchNextActivityNumber = async () => {
  //     try {
  //       const res = await fetch("/api/doctorsManage/getActivityNumber", {
  //         credentials: "include",
  //       });
  //       const data = await res.json();

  //       // Suppose you have doctorId available in your form
  //       if (doctorId && data[doctorId]) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           activityNumber: data[doctorId],
  //         }));
  //       }

  //     } catch (err) {
  //       console.error("Failed to fetch activity number:", err);
  //     }
  //   };

  //   if (doctorId) fetchNextActivityNumber();
  // }, [doctorId]);
