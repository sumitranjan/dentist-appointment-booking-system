// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminLogin from "./components/admin/AdminLogin";
import CustomerLogin from "./components/customer/CustomerLogin";
import DentistLogin from "./components/dentist/DentistLogin";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminDashboard from "./components/admin/AdminDashboard"; // Create this component
import CustomerDashboard from "./components/customer/CustomerDashboard"; // Create this component
import DentistDashboard from "./components/dentist/DentistDashboard"; // Create this component
import Unauthorized from "./components/common/Unauthorized"; // Create this component
import DashboardLayout from "./components/common/DashboardLayout";
import BookingHistory from "./components/customer/BookingHistory";
import AddServices from "./components/admin/AddService";
import ViewReports from "./components/admin/ViewReports";
import AddDentist from "./components/admin/AddDentist";
import CustomerRegister from "./components/customer/CustomerRegister";
import HomePage from "./components/common/HomePage";
import NotFound from "./components/common/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
