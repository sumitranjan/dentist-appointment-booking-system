import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const timeSlots = [
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function DentistWeeklyAppointmentView({
  selectedAppointment,
  appointments,
  onAppointmentComplete,
  onClose,
}) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(
      selectedAppointment
        ? new Date(selectedAppointment.appointment_date)
        : new Date()
    )
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] =
    useState(null);

  // const [bookings, setBookings] = useState([]);

  useEffect(() => {}, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("customer_id", user.id);

    if (data) {
      console.log("Fetched bookings:", data);
      setBookings(data);
    } else if (error) console.log("error:", error);
  };

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
  console.log("props appointments", appointments);
  const getAppointmentForSlot = (dayDate, timeSlot) => {
    return appointments.find((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);
      return (
        appointmentDate.toDateString() === dayDate.toDateString() &&
        appointment.time_slot === timeSlot
      );
    });
  };

  const formatDateRange = () => {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${currentWeekStart.getDate()} ${currentWeekStart.toLocaleString(
      "default",
      { month: "long" }
    )} - ${weekEnd.getDate()} ${weekEnd.toLocaleString("default", {
      month: "long",
    })} ${weekEnd.getFullYear()}`;
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointmentDetails(appointment);
    setIsDetailsOpen(true);
  };

  const handleAppointmentComplete = async () => {
    if (!selectedAppointmentDetails) return;
    await onAppointmentComplete(selectedAppointmentDetails);
    setIsDetailsOpen(false);
    setSelectedAppointmentDetails(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={onClose}
                  >
                    Back to Calendar
                  </button>
                  <h2 className="text-sm font-semibold">
                    Total Appointments: {appointments.length}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => navigateWeek("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm">{formatDateRange()}</span>
                  <button onClick={() => navigateWeek("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr,1fr] border-b">
              <div className="py-4 px-7 font-medium text-sm">Time</div>
              {days.map((day) => (
                <div
                  key={day}
                  className="p-4 font-medium text-sm text-center border-l"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="divide-y">
              {timeSlots.map((timeSlot) => (
                <div
                  key={timeSlot}
                  className="grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr,1fr]"
                >
                  <div className="p-4 text-sm">{timeSlot}</div>
                  {Array.from({ length: 6 }).map((_, index) => {
                    const dayDate = new Date(currentWeekStart);
                    dayDate.setDate(dayDate.getDate() + index);
                    const appointment = getAppointmentForSlot(
                      dayDate,
                      timeSlot
                    );
                    {
                      console.log("appointment", appointment);
                    }

                    return (
                      <div key={index} className="p-2 border-l min-h-[4rem]">
                        {appointment && (
                          <div
                            className={`p-2 rounded-md text-xs ${
                              appointment.status === "completed"
                                ? "bg-green-50 text-green-700"
                                : "bg-blue-50 text-blue-700"
                            } cursor-pointer`}
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="font-medium">
                              {appointment.fullName}
                            </div>
                            <div>
                              {appointment.service_name || "Dental Service"}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* {isDetailsOpen && selectedAppointmentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient
                </label>
                <p className="mt-1">{selectedAppointmentDetails.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <p className="mt-1">
                  {new Date(
                    selectedAppointmentDetails.appointment_date
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <p className="mt-1">{selectedAppointmentDetails.time_slot}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <p className="mt-1">{selectedAppointmentDetails.status}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-4">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  setIsDetailsOpen(false);
                  setSelectedAppointmentDetails(null);
                }}
              >
                Close
              </button>
              {selectedAppointmentDetails.status !== "completed" && (
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  onClick={handleAppointmentComplete}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
