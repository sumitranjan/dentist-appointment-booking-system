import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Dentist Appointment Booking System Home Page
      </h1>

      <div className="space-y-4 w-full max-w-md">
        {/* Customer Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Customer Pages</h2>
          <ul className="space-y-2">
            <li>
              Login -{" "}
              <Link to="/customer/login" className="text-blue-500 underline">
                /customer/login
              </Link>
            </li>
            <li>
              Register -{" "}
              <Link to="/customer/register" className="text-blue-500 underline">
                /customer/register
              </Link>
            </li>
            <li>
              Dashboard -{" "}
              <Link
                to="/customer/dashboard"
                className="text-blue-500 underline"
              >
                /customer/dashboard
              </Link>
            </li>
          </ul>
        </section>

        {/* Admin Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Admin Pages</h2>
          <ul className="space-y-2">
            <li>
              Login -{" "}
              <Link to="/admin/login" className="text-blue-500 underline">
                /admin/login
              </Link>
            </li>
            <li>
              Dashboard -{" "}
              <Link to="/admin/dashboard" className="text-blue-500 underline">
                /admin/dashboard
              </Link>
            </li>
          </ul>
        </section>

        {/* Dentist Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Dentist Pages</h2>
          <ul className="space-y-2">
            <li>
              Login -{" "}
              <Link to="/dentist/login" className="text-blue-500 underline">
                /dentist/login
              </Link>
            </li>
            <li>
              Dashboard -{" "}
              <Link to="/dentist/dashboard" className="text-blue-500 underline">
                /dentist/dashboard
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
