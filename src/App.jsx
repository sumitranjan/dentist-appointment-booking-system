// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminLogin from "./components/admin/AdminLogin";
import CustomerLogin from "./components/CustomerLogin";
import DentistLogin from "./components/DentistLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/admin/AdminDashboard"; // Create this component
import CustomerDashboard from "./components/CustomerDashboard"; // Create this component
import DentistDashboard from "./components/DentistDashboard"; // Create this component
import Unauthorized from "./components/Unauthorized"; // Create this component
import DashboardLayout from "./components/DashboardLayout";
import BookingHistory from "./components/BookingHistory";
import AddServices from "./components/admin/AddService";
import ViewReports from "./components/admin/ViewReports";
import AddDentist from "./components/admin/AddDentist";
import CustomerRegister from "./components/customer/CustomerRegister";
import NotFound from "./components/common/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CustomerLogin />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dentist/login" element={<DentistLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Customer Dashboard with Nested Routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="dashboard" element={<CustomerDashboard />} />
            <Route path="booking-history" element={<BookingHistory />} />
          </Route>

          <Route
            path="/dentist/dashboard"
            element={
              <ProtectedRoute allowedRoles={["dentist"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DentistDashboard />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="dashboard" element={<AdminDashboard />} />
            <Route path="add-services" element={<AddServices />} />
            <Route path="view-reports" element={<ViewReports />} />
            <Route path="add-dentist" element={<AddDentist />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
