import { NavLink } from "react-router-dom";

const Sidebar = ({ navItems, logout }) => {
  return (
    <aside className="w-64 bg-white shadow-md mt-4">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded ${
                    isActive ? "bg-gray-200" : "hover:bg-gray-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="p-4">
          {" "}
          {/* Add padding for spacing */}
          <button
            onClick={logout}
            className="block w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
