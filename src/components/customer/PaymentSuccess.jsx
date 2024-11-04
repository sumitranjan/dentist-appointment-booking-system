import { ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PaymentSuccess({ setPaymentSuccess }) {
  const navigate = useNavigate();
  function handleViewBookings() {
    setPaymentSuccess(false);

    navigate("/customer/booking-history");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="rounded-full border-2 border-gray-200 p-8 mb-6">
            <ThumbsUp className="w-16 h-16 text-gray-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-8">Payment Successful</h2>
          <button
            onClick={handleViewBookings}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            View Bookings
          </button>
        </div>
      </main>
    </div>
  );
}
