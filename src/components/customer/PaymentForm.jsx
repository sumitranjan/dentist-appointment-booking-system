import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { supabase } from "../../services/supabaseClient";

export default function PaymentForm({
  onCancel,
  onPaymentComplete,
  BookAppointmentDetail,
  setPaymentSuccess,
}) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showCVV, setShowCVV] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expirationDate: "",
    cvv: "",
    saveCard: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  console.log("BookAppointmentDetail:", BookAppointmentDetail);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mock payment processing
    setTimeout(() => {
      onPaymentComplete({
        status: "success",
        method: paymentMethod,
        ...formData,
      });
    }, 1000);

    const { error: bookingError } = await supabase.from("appointments").insert([
      {
        customer_id: BookAppointmentDetail.customer_id,
        dentist_id: BookAppointmentDetail.dentist_id,
        service_id: BookAppointmentDetail.service_id,
        appointment_date: BookAppointmentDetail.appointment_date,
        time_slot: BookAppointmentDetail.time_slot,
        status: BookAppointmentDetail.status,
        total_cost: BookAppointmentDetail.total_cost,
      },
    ]);

    if (bookingError) throw bookingError;
    console.log("Booking success");
    setPaymentSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Select Payment method</h2>

          <div className="flex border-b mb-6">
            <button
              className={`px-6 py-2 ${
                paymentMethod === "card"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              Card
            </button>
            <button
              className={`px-6 py-2 ${
                paymentMethod === "netbanking"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setPaymentMethod("netbanking")}
            >
              Net Banking
            </button>
            <button
              className={`px-6 py-2 ${
                paymentMethod === "upi"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setPaymentMethod("upi")}
            >
              UPI
            </button>
          </div>

          {paymentMethod === "card" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="cardholderName"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expirationDate"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    id="expirationDate"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      type={showCVV ? "text" : "password"}
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      maxLength="4"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCVV(!showCVV)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showCVV ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saveCard"
                  name="saveCard"
                  checked={formData.saveCard}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="saveCard"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Save Card
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Pay
                </button>
              </div>
            </form>
          )}

          {paymentMethod === "netbanking" && (
            <div className="text-center py-8 text-gray-500">
              Net Banking payment option coming soon
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className="text-center py-8 text-gray-500">
              UPI payment option coming soon
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
