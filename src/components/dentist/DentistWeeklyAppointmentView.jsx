import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { AuthContext } from "../../context/AuthContext";
import { timeSlots, days } from "../../utils/utils";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

export default function DentistWeeklyAppointmentView() {
  const [historyWeekStart, setHistoryWeekStart] = useState(new Date());
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const formatDate = (date) => {
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "long",
    })}`;
  };

  const weekEnd = new Date(historyWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 5);
  const weekRange = `${formatDate(historyWeekStart)} - ${formatDate(
    weekEnd
  )} ${weekEnd.getFullYear()}`;

  const getAppointmentForSlot = (day, time) => {
    const appointmentDate = new Date(historyWeekStart);
    appointmentDate.setDate(appointmentDate.getDate() + days.indexOf(day));
    const formattedDate = formatDateForComparison(appointmentDate);

    const appointment = bookings.find((booking) => {
      const bookingDate = booking.appointment_date;
      const bookingTime = booking.time_slot.slice(0, 5); // Get HH:MM from time_slot
      const slotTime = convertTo24Hour(time); // Convert time slot to 24-hour format

      return bookingDate === formattedDate && bookingTime === slotTime;
    });

    return appointment;
  };

  const formatDateForComparison = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    let hoursNum = parseInt(hours, 10);

    if (hoursNum === 12) {
      hoursNum = modifier === "PM" ? 12 : 0;
    } else if (modifier === "PM") {
      hoursNum += 12;
    }

    return `${hoursNum.toString().padStart(2, "0")}:${minutes}`;
  };

  const navigateWeek = (direction) => {
    const newStart = new Date(historyWeekStart);
    newStart.setDate(newStart.getDate() + (direction === "prev" ? -7 : 7));
    setHistoryWeekStart(newStart);
  };

  useEffect(() => {
    fetchDentists();
    fetchServices();
    fetchBookings();
  }, [refresh]);

  const fetchBookings = async () => {
    // const { data, error } = await supabase
    //   .from("appointments")
    //   .select("*")
    //   .eq("dentist_id", user.id);
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        profiles:customer_id(fullName,serviceRequired)
        `
      )
      .eq("dentist_id", user.id);

    if (data) {
      console.log("Fetched bookings:", data);
      setBookings(data);
    } else if (error) console.log("error:", error);
  };

  const fetchDentists = async () => {
    const { data, error } = await supabase.from("dentists").select("*");
    if (error) {
      console.log("fetchDentists error:", error);
      return;
    }
    console.log("Data from fetchDentists", data);
  };

  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
      console.log("fetchServices error:", error);
      return;
    }
    if (data.length) setServices(data);
  };

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s.service_id === serviceId);
    return service ? service.service_name : "Unknown Service";
  };

  const refreshData = () => setRefresh((prev) => !prev); // Toggle to refresh

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Booking History</h1>
        <div className="flex gap-4 items-center">
          <span>{weekRange}</span>
          <button
            className="px-4 py-2 border rounded"
            onClick={() => navigateWeek("prev")}
          >
            {"<"}
          </button>
          <button
            className="px-4 py-2 border rounded"
            onClick={() => navigateWeek("next")}
          >
            {">"}
          </button>
          <button
            className="px-4 py-2 border rounded"
            onClick={() => console.log("Close")}
          >
            Booking History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        <div className="bg-white p-2 text-center font-semibold">Time</div>
        {days.map((day) => (
          <div key={day} className="bg-white p-2 text-center font-semibold">
            {day}
          </div>
        ))}

        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className="bg-white p-2 text-center border-t">{time}</div>
            {days.map((day) => {
              const appointment = getAppointmentForSlot(day, time);
              console.log("Dentist weekly appointment", appointment);
              return (
                <div
                  key={`${day}-${time}`}
                  className={`bg-white p-2 border-t border-l min-h-[80px] ${
                    appointment && appointment.status === "completed"
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() =>
                    appointment &&
                    appointment.status !== "completed" &&
                    handleAppointmentClick(appointment)
                  }
                >
                  {appointment && (
                    <div
                      className={`text-xs p-1 rounded ${
                        appointment.status === "completed"
                          ? "bg-green-100"
                          : "bg-blue-50"
                      }`}
                    >
                      <div className="font-semibold">
                        {appointment.profiles.fullName}
                      </div>
                      <div>{getServiceName(appointment.service_id)}</div>
                      <div>{appointment.status}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      {isModalOpen && (
        <AppointmentDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refreshData={refreshData}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
}
