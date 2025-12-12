interface RestaurantCardProps {
  image: string;
  title: string;
  rating: number | string;
  time: string;
  price: number | string;
  category: string;
}

function RestaurantCard({ image, title, rating, time, price, category }: RestaurantCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 cursor-pointer">
      
      {/* Image */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover hover:scale-105 transition"
        />
      </div>

      {/* Details */}
      <h3 className="text-lg font-semibold mt-3">{title}</h3>

      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
        <span className="bg-green-600 text-white px-2 py-[2px] text-xs rounded-md">
          ⭐ {rating}
        </span>
        <p>• {time}</p>
      </div>

      <p className="text-gray-500 text-sm mt-1">{category}</p>
      <p className="font-semibold mt-1 text-gray-800">Items at ₹{price}</p>
    </div>
  );
}

export default RestaurantCard;
