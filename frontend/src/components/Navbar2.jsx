import { useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { NavLink } from "react-router";

const Navbar2 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="w-full bg-[#171717] text-white px-4 md:px-10 flex flex-row md:flex-row justify-between items-center gap-4 md:gap-0 py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <h2 className="text-xl">My Invoice App</h2>

          <div className="hidden md:flex items-center gap-2 md:gap-4">
            <span className="">&gt;</span>
            <p className="text-gray-400">Invoice</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto justify-between md:justify-end">
          <div className="relative w-full sm:max-w-xs scale-[0.9]">
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-200 text-lg" />
            <input
              type="search"
              placeholder="Search or type a command (Ctrl + G)"
              className="bg-[#232323] text-white placeholder:text-gray-200 outline-none py-2 pl-10 pr-4 rounded-xl w-full md:w-83"
            />
          </div>

          <IoNotifications className="text-xl hidden sm:block" />
          <div
            onClick={toggleSideBar}
            className="bg-blue-500 rounded-full px-2 py-1 text-lg hidden sm:block cursor-pointer hover:bg-blue-600 transition-colors"
          >
            VS
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#1f1f1f] text-white transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Menu</h3>
            <button
              onClick={toggleSideBar}
              className="text-gray-400 hover:text-white text-xl"
            >
              x
            </button>
          </div>
          <nav className="space-y-4">
            <NavLink
              to="/create-supplier"
              className="block py-2 px-3 rounded hover:bg-[#2a2a2a] transition-colors"
            >
              Add New Supplier
            </NavLink>

            <NavLink
              to="#"
              className="block py-2 px-3 rounded hover:bg-[#2a2a2a] transition-colors"
            >
              Update Supplier
            </NavLink>

            <NavLink
              to="#"
              className="block py-2 px-3 rounded hover:bg-[#2a2a2a] transition-colors"
            >
              Add New Item
            </NavLink>

            <NavLink
              to="#"
              className="block py-2 px-3 rounded hover:bg-[#2a2a2a] transition-colors"
            >
              Settings
            </NavLink>

            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 px-3 rounded hover:bg-red-600 bg-red-500 text-white transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSideBar}
        ></div>
      )}
    </>
  );
};

export default Navbar2;
