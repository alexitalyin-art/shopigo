export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">
            Shopigo
          </h1>

          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#" className="hover:text-gray-500">
              Home
            </a>
            <a href="#" className="hover:text-gray-500">
              Shop
            </a>
            <a href="#" className="hover:text-gray-500">
              About
            </a>
            <a href="#" className="hover:text-gray-500">
              Contact
            </a>
          </nav>

          <button className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100">
            Cart
          </button>
        </div>
      </header>

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

        <button className="mt-10 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-gray-800">
          Shop Now
        </button>
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
              <div
                key={product}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100">
                  <span className="text-sm text-gray-400">
                    Product Image
                  </span>
                </div>

                <h3 className="mt-5 font-semibold">
                  {product}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Coming soon
                </p>
              </div>
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