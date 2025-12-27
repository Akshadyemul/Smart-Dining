interface RestaurantCardProps {
  image: string[];
  title: string;
  rating: number | string;
  time: string;
  price: number | string;
  category: string;
}

function RestaurantCard({
  image,
  title,
  rating,
  time,
  price,
  category,
}: RestaurantCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden p-3 cursor-pointer">
      {/* Image */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-xl">
        {/* <img
        key={idx}
          src={image}
          alt={title}
          className="w-full h-40 object-cover hover:scale-105 transition"
        /> */}

        {image.map((img, idx) => (
          <img
            key={idx}
            src={img}
            // alt={name}
            className="w-full h-44 object-cover flex-shrink-0 snap-center"
          />
        ))}
      </div>

      {/* Details */}
      <h3 className="text-lg font-semibold mt-3">{title}</h3>

      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
        <span className="bg-green-600 text-white px-2 py-0.5 text-xs rounded">
          ⭐ {rating}
        </span>
        <p>• {time}</p>
      </div>

      <p className="text-gray-500 text-sm mt-1">{category}</p>
      <p className="font-medium text-sm mt-1 text-gray-800">Items at ₹{price}</p>
    </div>
  );
}

export default RestaurantCard;
