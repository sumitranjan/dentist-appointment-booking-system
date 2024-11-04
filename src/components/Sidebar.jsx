// const Sidebar = () => {
//   return (
//     <aside className="w-48 border-r min-h-[calc(100vh-4rem)]">
//       <div className="p-4 bg-muted">
//         <div className="flex items-center space-x-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="h-4 w-4"
//           >
//             <rect width="7" height="9" x="3" y="3" rx="1" />
//             <rect width="7" height="5" x="14" y="3" rx="1" />
//             <rect width="7" height="9" x="14" y="12" rx="1" />
//             <rect width="7" height="5" x="3" y="16" rx="1" />
//           </svg>
//           <span>Dashboard</span>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import { NavLink } from "react-router-dom";

const Sidebar = ({ navItems }) => {
  return (
    <aside className="w-64 bg-white shadow-md">
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
      </nav>
    </aside>
  );
};

export default Sidebar;
