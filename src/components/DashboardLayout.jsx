import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = () => {
  const { role } = useContext(AuthContext);

  const getNavItems = () => {
    switch (role) {
      case "customer":
        return [
          { name: "Dashboard", path: "/customer/dashboard" },
          {
            name: "Booking History",
            path: "/customer/booking-history",
          },
        ];
      case "dentist":
        return [
          { name: "Dashboard", path: "/dentist/dashboard" },
          // { name: "Booking History", path: "/dentist/booking-history" },
        ];
      case "admin":
        return [
          { name: "Dashboard", path: "/admin/dashboard" },
          { name: "Add Services", path: "/admin/add-services" },
          { name: "View Reports", path: "/admin/view-reports" },
          { name: "Add Dentist", path: "/admin/add-dentist" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar navItems={navItems} />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
