import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role } = useContext(AuthContext);
  //   console.log("Protected route contex: user:", user);
  //   console.log("Protected route contex: role:", role);
  let location = useLocation();
  const pathname = location.pathname.split("/")[1];

  //   console.log("location:", `/${pathname}/login`);

  if (!user) {
    return <Navigate to={`/${pathname}/login`} />;
  }
  //   console.log("allowedRoles: ", allowedRoles, "role:", role);

  if (!allowedRoles.includes(role)) {
    // alert("Please use correct email & password");
    return <Navigate to={`/${pathname}/login`} />;
  }

  return children;
};

export default ProtectedRoute;
