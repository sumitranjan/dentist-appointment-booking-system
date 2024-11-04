import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { LoaderCircle } from "lucide-react";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  // const [serviceName, setServiceName] = useState("");
  // const [servicePrice, setServicePrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      // Step 1: Fetch appointments
      const { data: appointmentsData, error: appointmentsError } =
        await supabase.from("appointments").select("*");

      if (appointmentsError) throw appointmentsError;

      // Step 2: Fetch profiles (for customer fullName)
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, fullName");

      if (profilesError) throw profilesError;

      // Step 3: Fetch dentists (for dentist full_name)
      const { data: dentistsData, error: dentistsError } = await supabase
        .from("dentists")
        .select("dentist_id, full_name");

      if (dentistsError) throw dentistsError;

      // Step 4: Fetch services (for service_name)
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("service_id, service_name");

      if (servicesError) throw servicesError;

      // Step 5: Map and merge data
      const enrichedAppointments = appointmentsData.map((appointment) => {
        const customer = profilesData.find(
          (p) => p.id === appointment.customer_id
        );
        const dentist = dentistsData.find(
          (d) => d.dentist_id === appointment.dentist_id
        );
        const service = servicesData.find(
          (s) => s.service_id === appointment.service_id
        );

        return {
          appointment_date: appointment.appointment_date,
          customer_fullName: customer?.fullName || "Unknown Customer",
          dentist_fullName: dentist?.full_name || "Unknown Dentist",
          service_name: service?.service_name || "Unknown Service",
        };
      });

      // Step 6: Set the enriched data to state
      setAppointments(enrichedAppointments);
    } catch (error) {
      console.error("Error fetching appointments data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("Admin appointments", appointments);

  // async function handleAddService(e) {
  //   e.preventDefault();
  //   try {
  //     const { error } = await supabase
  //       .from("services")
  //       .insert([{ name: serviceName, price: servicePrice }]);

  //     if (error) throw error;

  //     setServiceName("");
  //     setServicePrice("");
  //     alert("Service added successfully!");
  //   } catch (error) {
  //     console.error("Error adding service:", error);
  //   }
  // }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1">
        <main className="p-6">
          <div>
            <div className="flex justify-between mb-4">
              <h1 className="text-xl">Dashboard</h1>
              <button className="text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="bg-white rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Appointment date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Patient Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Dentist Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Service Requested
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-4">
                        <div className="flex justify-center items-center h-full">
                          <LoaderCircle size={100} />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    appointments.length > 0 &&
                    appointments.map((appointment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {appointment.appointment_date}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {appointment.customer_fullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {appointment.dentist_fullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {appointment.service_name}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
