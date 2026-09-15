import Header from "@/components/Header";
import ProductCard from "@/components/ui/ProductCard";

const products = [
  {
    name: "Men's Jeans",
    price: "₹999",
  },
  {
    name: "Winter Jacket",
    price: "₹1,499",
  },
  {
    name: "Casual Shirt",
    price: "₹799",
  },
  {
    name: "Men's T-Shirt",
    price: "₹499",
  },
  {
    name: "Denim Jacket",
    price: "₹1,299",
  },
  {
    name: "Casual Pants",
    price: "₹899",
  },
  {
    name: "Hoodie",
    price: "₹999",
  },
  {
    name: "New Arrival",
    price: "₹1,199",
  },
];

export default function ShopPage() {
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.name}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}