import { useState } from "react";
import { GoHome, GoSearch} from "react-icons/go";
import { BiQrScan } from "react-icons/bi";
import { IoFastFoodOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

function NavBar() {
  const [search, setSearch] = useState("");

  return (
    <>
      {/* ================= TOP NAV ================= */}
      <nav className="w-full bg-white px-6 py-4">
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <h1 className="text-3xl font-bold text-emerald-600 cursor-pointer">
            Smart Dining
          </h1>

          {/* Search (Desktop only) */}
          <div className="hidden md:flex flex-1 max-w-sm items-center bg-gray-100 px-4 py-2 rounded-lg gap-2">
            <GoSearch className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search restaurants, dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `hover:text-emerald-600 cursor-pointer ${isActive ? 'text-emerald-600' : 'text-gray-700'}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/scan"
                className={({ isActive }) =>
                  `hover:text-emerald-600 cursor-pointer ${isActive ? 'text-emerald-600' : 'text-gray-700'}`
                }
              >
                Scan QR
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/book"
                className={({ isActive }) =>
                  `hover:text-emerald-600 cursor-pointer ${isActive ? 'text-emerald-600' : 'text-gray-700'}`
                }
              >
                Book Table
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `hover:text-emerald-600 cursor-pointer ${isActive ? 'text-emerald-600' : 'text-gray-700'}`
                }
              >
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/help"
                className={({ isActive }) =>
                  `hover:text-emerald-600 cursor-pointer ${isActive ? 'text-emerald-600' : 'text-gray-700'}`
                }
              >
                Help
              </NavLink>
            </li>
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`
              }
            >
              Sign In
            </NavLink>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gray-100 shadow-lg">
        <ul className="flex justify-around py-2 text-sm font-medium text-gray-600">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 ${isActive ? 'text-emerald-600' : 'text-gray-600'}`
              }
            >
              <GoHome size={26} />
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/scan"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 ${isActive ? 'text-emerald-600' : 'text-gray-600'}`
              }
            >
              <BiQrScan size={26} />
              Scan
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 ${isActive ? 'text-emerald-600' : 'text-gray-600'}`
              }
            >
              <GoSearch size={26} />
              Search
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 ${isActive ? 'text-emerald-600' : 'text-gray-600'}`
              }
            >
              <IoFastFoodOutline size={26} />
              Orders
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default NavBar;
