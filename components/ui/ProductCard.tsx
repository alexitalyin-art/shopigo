type ProductCardProps = {
  name: string;
  price?: string;
  image?: string;
};

export default function ProductCard({
  name,
  price,
  image,
}: ProductCardProps) {
  return (
    <article className="group cursor-pointer rounded-2xl bg-white p-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* Product Image */}
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-sm text-gray-400 transition-transform duration-300 group-hover:scale-110">
            Product Image
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="px-2 pb-2 pt-4">
        <h3 className="font-semibold text-gray-900 transition-colors duration-300 group-hover:text-gray-600">
          {name}
        </h3>

        {price && (
          <p className="mt-1 text-sm text-gray-600">
            {price}
          </p>
        )}
      </div>
    </article>
  );
}