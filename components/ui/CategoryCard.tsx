type CategoryCardProps = {
  name: string;
  description?: string;
};

export default function CategoryCard({
  name,
  description,
}: CategoryCardProps) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* Category Visual */}
      <div className="flex aspect-[4/3] items-center justify-center">
        <div className="text-center transition-transform duration-300 group-hover:scale-110">
          <div className="text-4xl">🛍️</div>

          <h3 className="mt-3 text-xl font-bold text-gray-900">
            {name}
          </h3>

          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}