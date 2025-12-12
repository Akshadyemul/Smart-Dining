import demo from '../assets/demo.png'

function HomePage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16">
        
        {/* Left Text */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Experience Smart Dining  
            <span className="text-emerald-600"> Effortlessly</span>
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            Book tables, explore restaurants, and order food instantly using QR codes —  
            all in one seamless platform.
          </p>

          <div className="mt-6 space-x-4">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition">
              Reserve a Table
            </button>

            <button className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition">
              Order with QR
            </button>
          </div>
        </div>

        {/* Right Image */}
        <img
          src= {demo}
          alt="Restaurant"
          className="rounded-2xl shadow-xl mt-10 md:mt-0 w-full md:w-[45%]"
        />
      </section>

      {/* How It Works */}
      <section className="px-10 py-16 bg-white">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          How Smart Dining Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 mt-10">

          {/* Step 1 */}
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-emerald-600">1. Reserve a Table</h3>
            <p className="text-gray-600 mt-2">
              Choose date, time, number of guests, and pre-order dishes to reduce waiting time.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-emerald-600">2. Scan QR Code</h3>
            <p className="text-gray-600 mt-2">
              If you walk in directly, scan the QR code placed on your table to view the digital menu.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-emerald-600">3. Order & Pay</h3>
            <p className="text-gray-600 mt-2">
              Place orders instantly and pay online — hassle-free and fast service.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600">
        © {new Date().getFullYear()} Smart Dining — All Rights Reserved.
      </footer>
    </div>
  );
}

export default HomePage;
