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
    <div className="p-6">
      <div className="flex text-2xl font-semibold gap-2 items-center">
        <h3>What's on your mind?</h3>
        <IoIosArrowForward />
      </div>

      <div className="w-full py-8 bg-white">
        <div className="flex justify-center gap-12 flex-wrap">
          {categories.map((c, i) => (
            <FoodCategoryCard key={i} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FoodCategoryGrid;
