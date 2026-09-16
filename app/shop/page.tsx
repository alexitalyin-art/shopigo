import Header from "@/components/Header";
import ProductCard from "@/components/ui/ProductCard";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function ShopPage() {
  await connectDB();

  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Page Header */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Shop
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          All Products
        </h1>

        <p className="mt-4 max-w-xl text-gray-600">
          Discover products you'll love at prices you'll love.
        </p>
      </section>

      {/* Products */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          {products.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-semibold">
                No products available
              </h2>

              <p className="mt-3 text-gray-500">
                Products will appear here when they are added.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id.toString()}
                  name={product.name}
                  price={`₹${product.price.toLocaleString("en-IN")}`}
                  href={`/shop/${product.slug}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}