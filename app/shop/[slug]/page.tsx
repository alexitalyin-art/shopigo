import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  await connectDB();

  const product = await Product.findOne({
    slug,
    isActive: true,
  }).lean();

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-2">

          {/* Product Image */}
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400">
                Product Image
              </span>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              {product.category}
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <p className="text-2xl font-semibold">
                ₹{product.price.toLocaleString("en-IN")}
              </p>

              {product.compareAtPrice && (
                <p className="text-lg text-gray-400 line-through">
                  ₹{product.compareAtPrice.toLocaleString("en-IN")}
                </p>
              )}
            </div>

            <p className="mt-6 max-w-xl leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold">
                  Select Size
                </h2>

                <div className="mt-3 flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium transition hover:border-black hover:bg-black hover:text-white"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold">
                  Color
                </h2>

                <div className="mt-3 flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium transition hover:border-black hover:bg-black hover:text-white"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="mt-8">
              {product.stock > 0 ? (
                <p className="text-sm font-medium text-green-600">
                  In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-sm font-medium text-red-600">
                  Out of Stock
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button>
                Add to Cart
              </Button>

              <Button variant="secondary">
                Buy Now
              </Button>
            </div>

            {/* Product Details */}
            <div className="mt-10 border-t border-gray-200 pt-6">
              <div className="space-y-4 text-sm">

                <div className="flex justify-between border-b border-gray-100 pb-4">
                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="font-medium">
                    {product.category}
                  </span>
                </div>

                {product.sku && (
                  <div className="flex justify-between border-b border-gray-100 pb-4">
                    <span className="text-gray-500">
                      SKU
                    </span>

                    <span className="font-medium">
                      {product.sku}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Availability
                  </span>

                  <span className="font-medium">
                    {product.stock > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}