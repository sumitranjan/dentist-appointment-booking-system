import { useState } from "react";
import { BookingHistory } from "./BookingHistory";

// Main App Component to handle view switching
export default function DentalApp() {
  const [view, setView] = useState("payment-success"); // or 'booking-history'

  if (view === "payment-success") {
    return <PaymentSuccess onViewBookings={() => setView("booking-history")} />;
  }

  return <BookingHistory />;
}
