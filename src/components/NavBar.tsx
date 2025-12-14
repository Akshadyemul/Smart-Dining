import { useState } from "react";
import { IoSearch } from "react-icons/io5";

function NavBar() {
  const [search, setSearch] = useState("");

  return (
    <>
      <nav className="w-full bg-white px-6 py-4">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-emerald-600 cursor-pointer">
            Smart Dining
          </h1>

          <div className="flex-1 max-w-sm hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-lg gap-2">
            <IoSearch className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search restaurants, dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
            <li className="hover:text-emerald-600 cursor-pointer">Home</li>
            <li className="hover:text-emerald-600 cursor-pointer">Scan QR</li>
            <li className="hover:text-emerald-600 cursor-pointer">
              Book Table
            </li>
            <li className="hover:text-emerald-600 cursor-pointer">Orders</li>
            <li className="hover:text-emerald-600 cursor-pointer">Help</li>
          </ul>

          <button className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg transition">
            Sign In
          </button>
        </div>

        <div>
          <ul className="md:hidden flex justify-center gap-6 text-[18px] mt-4 font-semibold text-gray-700">
            <li className="hover:text-emerald-600 cursor-pointer">Home</li>
            <li className="hover:text-emerald-600 cursor-pointer">Scan QR</li>
            <li className="hover:text-emerald-600 cursor-pointer">
              Book Table
            </li>
            <li className="hover:text-emerald-600 cursor-pointer">Orders</li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
