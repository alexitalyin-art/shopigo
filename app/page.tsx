import CategoryCard from "@/components/ui/CategoryCard";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
          Welcome to Shopigo
        </p>

        <h2 className="text-5xl font-bold tracking-tight md:text-7xl">
          Shop more.
          <br />
          Pay less.
          <br />
          Live better.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
          Discover products you love at prices you'll love.
        </p>

        <div className="mt-10">
          <Button>Shop Now</Button>
        </div>
      </section>
      {/* Shop by Category */}
      <section className="border-t border-gray-200 bg-white">
  <div className="mx-auto max-w-7xl px-6 py-20">
    <div className="mb-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
        Explore
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        Shop by Category
      </h2>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <CategoryCard
        name="Men"
        description="Everyday essentials"
      />

      <CategoryCard
        name="Jackets"
        description="Stay warm in style"
      />

      <CategoryCard
        name="Casual Wear"
        description="Comfort meets style"
      />

      <CategoryCard
        name="New Arrivals"
        description="Fresh styles"
      />
    </div>
  </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Discover
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Featured Products
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Men's Jeans",
              "Winter Jackets",
              "Casual Wear",
              "New Arrivals",
            ].map((product) => (
              <ProductCard
                key={product}
                name={product}
                price="Coming soon"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Shopigo. All rights reserved.
        </div>
      </footer>
    </main>
  );
}