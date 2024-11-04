import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user } = useContext(AuthContext);
  console.log("Header Daschboard:", user);
  return (
    <header className="bg-white shadow">
      <div className="max-w-9xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-2xl font-bold">LOGO</div>
          {/* <nav className="ml-10">
              <a href="#" className="text-gray-900">
                Dashboard
              </a>
            </nav> */}
        </div>
        <div className="flex items-center">
          <span className="mr-4">Patient</span>
          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
