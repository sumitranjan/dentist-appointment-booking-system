import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { X, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  format,
} from "date-fns";

const ViewReport = () => {
  const [viewType, setViewType] = useState("weekly");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPatientList, setShowPatientList] = useState(false);
  const [selectedDentistPatients, setSelectedDentistPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchBookings();
  }, [viewType, selectedDate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let startDate, endDate;
      if (viewType === "weekly") {
        startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
        endDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
      } else {
        startDate = startOfMonth(selectedDate);
        endDate = endOfMonth(selectedDate);
      }

      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          appointment_date,
          dentists (
            dentist_id,
            full_name
          )
        `
        )
        .gte("appointment_date", format(startDate, "yyyy-MM-dd"))
        .lte("appointment_date", format(endDate, "yyyy-MM-dd"));

      if (error) throw error;

      const processedData = data.reduce((acc, booking) => {
        const key = `${booking.appointment_date}-${booking.dentists.dentist_id}`;
        if (!acc[key]) {
          acc[key] = {
            date: booking.appointment_date,
            dentistName: booking.dentists.full_name,
            bookingsCount: 1,
            dentist_id: booking.dentists.dentist_id,
          };
        } else {
          acc[key].bookingsCount += 1;
        }
        return acc;
      }, {});

      const sortedData = Object.values(processedData).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setBookings(sortedData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientList = async (date, dentist_id) => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          profiles(fullName),
          services(service_name),
          appointment_date,
          dentists(dentist_id)
        `
        )
        .eq("appointment_date", date)
        .eq("dentists.dentist_id", dentist_id);

      if (error) throw error;

      setSelectedDentistPatients(
        data.map((appointment) => ({
          patientName: appointment.profiles.fullName,
          serviceRequested: appointment.services.service_name,
          bookingDate: appointment.appointment_date,
        }))
      );

      setShowPatientList(true);
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  };

  console.log("showPatientList", showPatientList);
  console.log("Vie report: bookings", bookings);

  const changeDate = (amount) => {
    if (viewType === "weekly") {
      setSelectedDate(
        amount > 0 ? addWeeks(selectedDate, 1) : subWeeks(selectedDate, 1)
      );
    } else {
      setSelectedDate(
        amount > 0 ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1)
      );
    }
  };

  const getDateRangeText = () => {
    if (viewType === "weekly") {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
    } else {
      return format(selectedDate, "MMMM yyyy");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">View Report</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="flex bg-gray-200 rounded-lg p-1 w-fit">
            <button
              onClick={() => setViewType("weekly")}
              className={`px-4 py-2 rounded-md ${
                viewType === "weekly"
                  ? "bg-white shadow-sm"
                  : "hover:bg-gray-100"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewType("monthly")}
              className={`px-4 py-2 rounded-md ${
                viewType === "monthly"
                  ? "bg-white shadow-sm"
                  : "hover:bg-gray-100"
              }`}
            >
              Monthly
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-lg font-medium">{getDateRangeText()}</span>
            <button
              onClick={() => changeDate(1)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dentist Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Of Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-4">
                    <div className="flex justify-center items-center h-full">
                      <LoaderCircle size={100} />
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No bookings found for this period.
                  </td>
                </tr>
              ) : (
                bookings.map((booking, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(booking.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.dentistName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.bookingsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() =>
                          fetchPatientList(booking.date, booking.dentist_id)
                        }
                        className="bg-gray-100 px-4 py-1 rounded-md hover:bg-gray-200"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showPatientList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full m-4">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Patient List</h2>
                <button
                  onClick={() => setShowPatientList(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Patient Name</th>
                      <th className="px-4 py-2 text-left">Service Requested</th>
                      <th className="px-4 py-2 text-left">Booking date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDentistPatients.map((patient, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{patient.patientName}</td>
                        <td className="px-4 py-2">
                          {patient.serviceRequested}
                        </td>
                        <td className="px-4 py-2">
                          {format(new Date(patient.bookingDate), "MMM d, yyyy")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end p-4 border-t">
                <button
                  onClick={() => setShowPatientList(false)}
                  className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReport;
