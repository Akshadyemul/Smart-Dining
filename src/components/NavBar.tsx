function NavBar() {
  return (
    <nav className="w-full bg-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-emerald-600">
        Smart Dining
      </h1>

      <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
        <li className="hover:text-emerald-600 cursor-pointer">Home</li>
        <li className="hover:text-emerald-600 cursor-pointer">Reserve Table</li>
        <li className="hover:text-emerald-600 cursor-pointer">Menu</li>
        <li className="hover:text-emerald-600 cursor-pointer">Orders</li>
        <li className="hover:text-emerald-600 cursor-pointer">Help</li>
      </ul>

      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg transition">
        Sign In
      </button>
    </nav>
  );
}

export default NavBar;