import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../../services/supabaseClient";

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "completed" })
        .eq("appointment_id", appointment.appointment_id);

      if (error) throw error;
      alert("Appointment completed successfully.");

      onClose();
      refreshData();
    } catch (error) {
      console.error("Error completing appointment:", error.message);
      alert("Failed to complete appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Appointment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Patient Name
            </h3>
            <p className="text-base text-gray-900">
              {appointment.profiles.fullName}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Service Name
            </h3>
            <p className="text-base text-gray-900">
              {appointment.profiles.serviceRequired}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            disabled={loading}
          >
            {loading ? "Completing..." : "Complete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
