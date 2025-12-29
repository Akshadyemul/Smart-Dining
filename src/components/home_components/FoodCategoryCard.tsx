interface FoodCategoryCardProps {
  image: string;
  name: string;
}

function FoodCategoryCard({ image, name }: FoodCategoryCardProps) {
  return (
    <div className="flex flex-col items-center cursor-pointer">
      <img
        src={image}
        alt={name}
        className="w-22 h-22 object-cover rounded-full shadow-sm hover:scale-105 transition"
      />
      <p className="mt-2 text-gray-700 font-medium text-lg">{name}</p>
    </div>
  );
}

export default FoodCategoryCard;
