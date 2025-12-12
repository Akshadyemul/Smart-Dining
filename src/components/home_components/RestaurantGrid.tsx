import RestaurantCard from "./RestaurantCard";
import { IoIosArrowForward } from "react-icons/io";

function RestaurantGrid() {
  const restaurants = [
    {
      title: "Pizza Hut",
      image:
        "https://images.unsplash.com/photo-1624855600799-ac8e8bddd1da?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: "4.2",
      time: "30–40 mins",
      price: "79",
      category: "Pizzas",
    },
    {
      title: "KFC",
      image:
        "https://plus.unsplash.com/premium_photo-1683657860906-d49d1bb37aab?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: "4.2",
      time: "20–25 mins",
      price: "69",
      category: "Fast Food",
    },
    {
      title: "McDonald's",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
      rating: "4.3",
      time: "15–20 mins",
      price: "99",
      category: "Burgers, Café",
    },
    {
      title: "Domino's Pizza",
      image:
        "https://plus.unsplash.com/premium_photo-1733306588881-0411931d4fed?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: "4.2",
      time: "20–25 mins",
      price: "59",
      category: "Italian",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex text-2xl gap-2 items-center font-semibold mb-3">
          <h3 className="font-semibold text-2xl">Restaurants near you</h3>
          <IoIosArrowForward />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map((r, i) => (
            <RestaurantCard key={i} {...r} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex text-2xl gap-2 items-center font-semibold mb-3">
          <h3 className="font-semibold text-2xl">
            Top Restaurants in your city
          </h3>
          <IoIosArrowForward />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map((r, i) => (
            <RestaurantCard key={i} {...r} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RestaurantGrid;
