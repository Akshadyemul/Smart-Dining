import FoodCategoryCard from "./FoodCategoryCard";
import { IoIosArrowForward } from "react-icons/io";

function FoodCategoryGrid() {
  const categories = [
    {
      name: "Burgers",
      image:
        "https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Momos",
      image:
        "https://images.unsplash.com/photo-1738608084602-f9543952188e?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Rolls",
      image:
        "https://images.unsplash.com/photo-1563282397-db1ac3a6bf86?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Pizzas",
      image:
        "https://images.unsplash.com/photo-1598023696416-0193a0bcd302?q=80&w=1236&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Cakes",
      image:
        "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=803&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "French Fries",
      image:
        "https://images.unsplash.com/photo-1598679253544-2c97992403ea?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex text-2xl font-semibold gap-2 items-center">
        <h3>What's on your mind?</h3>
        <IoIosArrowForward />
      </div>

      <div className="w-full py-3">
        <div className="overflow-x-auto scroll-smooth flex gap-3 md:justify-center md:gap-6 md:flex-wrap scrollbar-hide">
          {categories.map((c, i) => (
            <div key={i} className="flex-none px-0.2">
              <FoodCategoryCard {...c} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default FoodCategoryGrid;
