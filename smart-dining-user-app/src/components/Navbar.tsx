import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Utensils,
  User,
  ShoppingCart,
  Calendar,
  LogOut,
  ChevronDown,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cartItemCount = getItemCount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/overview" className="flex items-center space-x-2">
            <Utensils className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-900">
              Smart Dining
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${isActive
                      ? "text-orange-500 underline underline-offset-4"
                      : "text-gray-700 hover:text-orange-500"
                    }`
                  }
                >
                  Home
                </NavLink>
                {/* <NavLink
                  to="/menu"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${isActive
                      ? "text-orange-500 underline underline-offset-4"
                      : "text-gray-700 hover:text-orange-500"
                    }`
                  }
                >
                  Menu
                </NavLink> */}
                {/* <NavLink
                  to="/book-table"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${isActive
                      ? "text-orange-500 underline underline-offset-4"
                      : "text-gray-700 hover:text-orange-500"
                    }`
                  }
                >
                  Book Table
                </NavLink> */}
                <NavLink
                  to="/reservations"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${isActive
                      ? "text-orange-500 underline underline-offset-4"
                      : "text-gray-700 hover:text-orange-500"
                    }`
                  }
                >
                  My Reservations
                </NavLink>
                <NavLink
                  to="/my-orders"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${isActive
                      ? "text-orange-500 underline underline-offset-4"
                      : "text-gray-700 hover:text-orange-500"
                    }`
                  }
                >
                  My Orders
                </NavLink>
              </>
            )}


          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <User className="h-5 w-5" />
                      <span className="max-w-[100px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-orders")}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/reservations")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Reservations
                    </DropdownMenuItem>



                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                {/* <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button> */}
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded ${isActive
                    ? "text-orange-500 underline underline-offset-4"
                    : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/menu"
                className={({ isActive }) =>
                  `px-4 py-2 rounded ${isActive
                    ? "text-orange-500 underline underline-offset-4"
                    : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </NavLink>
              {user && (
                <>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive
                        ? "text-orange-500 underline underline-offset-4"
                        : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/book-table"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive
                        ? "text-orange-500 underline underline-offset-4"
                        : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Book Table
                  </NavLink>
                  <NavLink
                    to="/reservations"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive
                        ? "text-orange-500 underline underline-offset-4"
                        : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Reservations
                  </NavLink>
                  <NavLink
                    to="/my-orders"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded ${isActive
                        ? "text-orange-500 underline underline-offset-4"
                        : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded flex items-center ${isActive
                        ? "text-orange-500 underline underline-offset-4"
                        : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart
                    {cartItemCount > 0 && (
                      <span className="ml-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </NavLink>
                </>
              )}

              {!user ? (
                <>
                  {/* <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link> */}
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:bg-gray-100 rounded text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
