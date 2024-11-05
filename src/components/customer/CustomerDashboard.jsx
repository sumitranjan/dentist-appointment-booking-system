import { useState, useEffect, useContext, useMemo } from "react";
import { supabase } from "../../services/supabaseClient";
import { AuthContext } from "../../context/AuthContext";
import PaymentForm from "./PaymentForm";
import { PaymentSuccess } from "./PaymentSuccess";

import { timeSlots } from "../../utils/utils";

export default function CustomerDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { user } = useContext(AuthContext);

  const [bookAppointmentDetail, setBookAppointmentDetail] = useState({});

  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [allBookings, setAllBookings] = useState([]);

  const [errors, setErrors] = useState({
    dentist: "",
    service: "",
    time: "",
  });
  console.log("");

  useEffect(() => {
    fetchDentists();
    fetchServices();
    fetchBookings();
    fetchAllBookings();
  }, []);

  const fetchDentists = async () => {
    const { data, error } = await supabase.from("dentists").select("*");

    if (error) {
      console.log("fetchDentists error: 1", error);
      return;
    }

    if (data.length) {
      setDentists(data);
    }
  };
  console.log("setDentists:", dentists);

  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*");
    // console.log("fetchServices data:", data);

    if (error) {
      console.log(" fetchServices error:", error);
      return;
    }

    if (data.length) setServices(data);
  };

  console.log("services:", services);

  console.log(
    "selectedDentist:",
    selectedDentist,
    "selectedService:",
    selectedService
  );

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("customer_id", user.id);

    if (data) setBookings(data);
    else if (error) console.log("error:", error);
  };

  console.log("setBookings", bookings);

  const handleDateClick = (date) => {
    const day = date.getDay();
    if (date < new Date()) {
      alert("Cannot book an appointment for a past date.");
      return;
    }
    if (day === 0 || day === 6) {
      alert("Bookings are only available Monday to Friday");
      return;
    }
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handlePayment = async () => {
    setErrors({
      dentist: "",
      service: "",
      time: "",
    });

    let hasError = false;

    if (!selectedDentist) {
      setErrors((prev) => ({ ...prev, dentist: "Please select a dentist!" }));
      hasError = true;
    }

    if (!selectedService) {
      setErrors((prev) => ({ ...prev, service: "Please select a service!" }));
      hasError = true;
    }

    if (!selectedTime) {
      setErrors((prev) => ({ ...prev, time: "Please select a time slot!" }));
      hasError = true;
    }

    if (hasError) return;

    setIsModalOpen((isModalOpen) => !isModalOpen);
    setShowPayment(true);
    console.log("selectedDate", selectedDate);
    setBookAppointmentDetail({
      customer_id: user.id,
      dentist_id: selectedDentist.dentist_id,
      service_id: selectedService.service_id,
      appointment_date: formatToDateString(new Date(selectedDate)),
      time_slot: selectedTime,
      status: "Booked",
      total_cost: totalAmount,
    });

    // fetchBookings();
  };

  const formatToDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
    return `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
  };

  const fetchAllBookings = async () => {
    const { data, error } = await supabase.from("appointments").select("*");
    if (data) setAllBookings(data);
    else if (error) console.log("error:", error);
  };

  console.log("isModalOpen", isModalOpen);
  console.log("showPayment", showPayment);
  console.log("paymentSuccess", paymentSuccess);

  console.log("allBookings", allBookings);

  const isDentistAvailable = (dentistId) => {
    if (!selectedDate) return true;

    const formattedDate = selectedDate.toLocaleDateString("en-CA"); // 'en-CA' is for 'YYYY-MM-DD' format
    const dentistBookings = allBookings.filter(
      (booking) =>
        booking.dentist_id === dentistId &&
        booking.appointment_date === formattedDate
    );

    return dentistBookings.length < 2;
  };

  // Helper function to convert 24-hour time to 12-hour format with leading zero
  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":");
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = ("0" + (hour % 12 || 12)).slice(-2); // Add leading zero
    return `${formattedHour}:${minute} ${suffix}`;
  };

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedDentist) return timeSlots;

    const formattedDate = selectedDate.toLocaleDateString("en-CA"); // 'en-CA' is for 'YYYY-MM-DD' format
    const bookedSlots = allBookings
      .filter(
        (booking) =>
          booking.dentist_id === selectedDentist.dentist_id &&
          booking.appointment_date === formattedDate
      )
      .map((booking) => convertTo12HourFormat(booking.time_slot)); // Convert booked slots to 12-hour format

    console.log();
    console.log(
      "selectedDate",
      selectedDate,
      "formattedDate",
      formattedDate,
      "bookedSlots",
      bookedSlots,
      "availableTimeSlots",
      timeSlots.filter((slot) => !bookedSlots.includes(slot))
    );
    console.log();

    return timeSlots.filter((slot) => !bookedSlots.includes(slot));
  }, [selectedDate, selectedDentist, allBookings]);

  const handlePaymentComplete = () => {
    // Process the payment details and create appointment
    // createAppointment(paymentDetails);
    console.log("handlePaymentComplete , setIsModalOpen", isModalOpen);
    setIsModalOpen(false);

    setShowPayment(false);
    fetchAllBookings();
  };

  function handleCancel() {
    setSelectedDate(null);
    setIsModalOpen(false);
    setSelectedDentist(null);
    setSelectedService(null);
    setSelectedTime(null);
    setErrors({
      dentist: "",
      service: "",
      time: "",
    });
  }

  useEffect(() => {
    const calculateTotal = () => {
      const dentistRate = selectedDentist ? selectedDentist.hourly_fee : 0;
      const servicePrice = selectedService ? selectedService.price : 0;

      return dentistRate + servicePrice;
    };

    setTotalAmount(calculateTotal());
  }, [selectedDentist, selectedService]);

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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      const dayBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.appointment_date);
        return (
          bookingDate.getDate() === day &&
          bookingDate.getMonth() === date.getMonth() &&
          bookingDate.getFullYear() === date.getFullYear()
        );
      });

      const maxVisibleBookings = 2;
      const visibleBookings = dayBookings.slice(0, maxVisibleBookings);
      const extraBookings = dayBookings.length - maxVisibleBookings;

      days.push(
        <div
          key={day}
          className={`h-28 border p-2 ${
            isWeekend ? "bg-gray-100" : "cursor-pointer hover:bg-blue-100"
          } flex flex-col`}
          onClick={() => !isWeekend && handleDateClick(date)}
        >
          <span className={`text-xs ${isWeekend ? "text-gray-400" : ""}`}>
            {day}
          </span>
          <div className="flex-grow overflow-hidden">
            {visibleBookings.map((booking, index) => (
              <div
                key={index}
                className={`mt-1 text-xs p-1 rounded truncate ${
                  booking.status === "completed"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {booking.status === "completed"
                  ? "Completed apt."
                  : dentists.find((d) => d.dentist_id === booking.dentist_id)
                      ?.full_name || "Appointment"}
              </div>
            ))}
            {extraBookings > 0 && (
              <div className="mt-1 text-xs p-1 text-gray-500">
                +{extraBookings} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {!showPayment && !paymentSuccess && (
        <main className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Book Appointment</h1>
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
                <button className="px-4 py-2 border rounded">
                  Booking History
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              <div className="text-center font-semibold">Sun</div>
              <div className="text-center font-semibold">Mon</div>
              <div className="text-center font-semibold">Tue</div>
              <div className="text-center font-semibold">Wed</div>
              <div className="text-center font-semibold">Thu</div>
              <div className="text-center font-semibold">Fri</div>
              <div className="text-center font-semibold">Sat</div>
              {renderCalendar()}
            </div>
          </div>
        </main>
      )}
      {/* Book Appointment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
            <div className="mb-4">
              <span className="block text-sm font-medium text-gray-700">
                {selectedDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Dentist
              </label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedDentist?.dentist_id || ""}
                onChange={(e) => {
                  setSelectedDentist(
                    dentists.find((d) => d.dentist_id === e.target.value)
                  );
                  setSelectedTime(null);
                }}
              >
                <option value="">Select Dentist</option>
                {dentists.map((dentist) => (
                  <option
                    key={dentist.dentist_id}
                    value={dentist.dentist_id}
                    disabled={!isDentistAvailable(dentist.dentist_id)}
                  >
                    {dentist.full_name}
                  </option>
                ))}
              </select>

              {errors.dentist && (
                <p className="text-red-500 text-sm">{errors.dentist}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Service
              </label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedService?.service_id || ""}
                onChange={(e) => {
                  setSelectedService(
                    services.find((s) => s.service_id === e.target.value)
                  );
                }}
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.service_name}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="text-red-500 text-sm">{errors.service}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Time Slot
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      selectedTime === time
                        ? "bg-blue-600 text-white"
                        : availableTimeSlots.includes(time)
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        : "bg-gray-400 text-gray-900 cursor-not-allowed"
                    }`}
                    disabled={!availableTimeSlots.includes(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time}</p>
              )}
            </div>

            <div className="mt-6 justify-start">
              <div className="flex justify-start items-center">
                <span className="text-lg font-semibold">Rs. {totalAmount}</span>
                <span className="px-1 text-sm text-gray-500">
                  Including GST
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-4">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={handlePayment}
              >
                Make Payment
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PaymentForm */}
      {showPayment && (
        <PaymentForm
          //   amount={calculateTotal()}
          onCancel={() => setShowPayment(false)}
          onPaymentComplete={handlePaymentComplete}
          BookAppointmentDetail={bookAppointmentDetail}
          setPaymentSuccess={setPaymentSuccess}
        />
      )}
      {/* PaymentSuccess */}
      {paymentSuccess && (
        <PaymentSuccess setPaymentSuccess={setPaymentSuccess} />
      )}
    </div>
  );
}
