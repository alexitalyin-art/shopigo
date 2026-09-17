import { notFound } from "next/navigation";
import Header from "@/components/Header";
import AddToCartButton from "@/components/cart/AddToCartButton";
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

            {/* Category */}
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              {product.category}
            </p>

            {/* Product Name */}
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {product.name}
            </h1>

            {/* Price */}
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

            {/* Description */}
            <p className="mt-6 max-w-xl leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mt-8">
              {product.stock <= 0 ? (
                <p className="text-sm font-medium text-red-600">
                  Out of Stock
                </p>
              ) : product.stock <= 5 ? (
                <p className="text-sm font-medium text-orange-600">
                  Only a few left in stock
                </p>
              ) : (
                <p className="text-sm font-medium text-green-600">
                  In Stock
                </p>
              )}
            </div>

            {/* Product Actions */}
            <div className="mt-8">
              <AddToCartButton
                productId={product._id.toString()}
                name={product.name}
                slug={product.slug}
                price={product.price}
                image={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : undefined
                }
                stock={product.stock}
                sizes={product.sizes}
                colors={product.colors}
              />
            </div>

            {/* Product Details */}
            <div className="mt-10 border-t border-gray-200 pt-6">
              <div className="space-y-4 text-sm">

                {/* Category */}
                <div className="flex justify-between border-b border-gray-100 pb-4">
                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="font-medium">
                    {product.category}
                  </span>
                </div>

                {/* SKU */}
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

                {/* Availability */}
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Availability
                  </span>

                  <span className="font-medium">
                    {product.stock <= 0
                      ? "Out of Stock"
                      : product.stock <= 5
                        ? "Only a few left"
                        : "In Stock"}
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