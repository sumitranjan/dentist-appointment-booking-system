import { useState, useEffect, useContext } from "react";
import { supabase } from "../services/supabaseClient";
import { AuthContext } from "../context/AuthContext";
import DentistWeeklyAppointmentView from "./DentistWeeklyAppointmentView";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function DentistDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showWeeklyView, setShowWeeklyView] = useState(false);
  const { user } = useContext(AuthContext);
  // console.log("user:", user);

  useEffect(() => {
    fetchAppointments();
  }, [user.id]);

  const fetchAppointments = async () => {
    try {
      const { data: appointments, error: appointmentError } = await supabase
        .from("appointments")
        .select("*")
        .eq("dentist_id", user.id);

      if (appointmentError) throw appointmentError;

      const customerIds = [
        ...new Set(appointments.map((appt) => appt.customer_id)),
      ];

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, fullName")
        .in("id", customerIds);

      if (profilesError) throw profilesError;

      const profilesMap = profiles.reduce((map, profile) => {
        map[profile.id] = profile.fullName;
        return map;
      }, {});

      const appointmentsWithNames = appointments.map((appt) => ({
        ...appt,
        fullName: profilesMap[appt.customer_id] || "Unknown",
      }));

      setAppointments(appointmentsWithNames);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleAppointmentComplete = async (appointment) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "completed" })
      .eq("appointment_id", appointment.appointment_id);

    if (error) {
      console.error("Error updating appointment:", error);
      return;
    }

    await fetchAppointments();
  };

  const getTotalAppointments = () => {
    const today = new Date();
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);
      return (
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear()
      );
    }).length;
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      const dayAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointment_date);
        return (
          appointmentDate.getDate() === day &&
          appointmentDate.getMonth() === date.getMonth() &&
          appointmentDate.getFullYear() === date.getFullYear()
        );
      });

      const maxVisibleAppointments = 2;
      const visibleAppointments = dayAppointments.slice(
        0,
        maxVisibleAppointments
      );

      days.push(
        <div
          key={day}
          className={`h-28 border p-2 ${
            isWeekend ? "bg-gray-100" : "cursor-pointer hover:bg-blue-100"
          } flex flex-col`}
        >
          <span className={`text-xs ${isWeekend ? "text-gray-400" : ""}`}>
            {day}
          </span>
          <div className="flex-grow overflow-hidden">
            {visibleAppointments.map((appointment, index) => (
              <div
                key={index}
                className={`mt-1 text-xs p-1 rounded truncate ${
                  appointment.status === "completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-50 text-blue-600"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAppointment(appointment);
                  setShowWeeklyView(true);
                }}
              >
                {`${appointment.time_slot} - ${appointment.fullName}`}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  if (showWeeklyView) {
    return (
      <DentistWeeklyAppointmentView
        selectedAppointment={selectedAppointment}
        appointments={appointments}
        onAppointmentComplete={handleAppointmentComplete}
        onClose={() => {
          setShowWeeklyView(false);
          setSelectedAppointment(null);
        }}
      />
      // <DentistWeeklyAppointmentView />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <main className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold">
                Total Appointments: {getTotalAppointments()}
              </h2>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Appointments Calendar</h1>
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1,
                        1
                      )
                    )
                  }
                >
                  {"<"}
                </button>
                <span className="px-4 py-2">
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1,
                        1
                      )
                    )
                  }
                >
                  {">"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => (
                <div key={day} className="text-center font-semibold">
                  {day.slice(0, 3)}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
