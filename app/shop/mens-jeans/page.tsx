import Header from "@/components/Header";
import Button from "@/components/ui/Button";

export default function MensJeansPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">

          {/* Product Image */}
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-100">
            <span className="text-gray-400">
              Product Image
            </span>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Men's Collection
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Men's Jeans
            </h1>

            <p className="mt-6 text-2xl font-semibold">
              ₹999
            </p>

            <p className="mt-6 leading-7 text-gray-600">
              Comfortable and stylish men's jeans designed for everyday wear.
              Perfect for casual outfits and daily use.
            </p>

            {/* Size */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold">
                Select Size
              </h2>

              <div className="mt-3 flex gap-3">
                <button className="rounded-lg border border-gray-300 px-5 py-3 text-sm hover:border-black">
                  30
                </button>

                <button className="rounded-lg border border-gray-300 px-5 py-3 text-sm hover:border-black">
                  32
                </button>

                <button className="rounded-lg border border-gray-300 px-5 py-3 text-sm hover:border-black">
                  34
                </button>

                <button className="rounded-lg border border-gray-300 px-5 py-3 text-sm hover:border-black">
                  36
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-8">
              <Button>
                Add to Cart
              </Button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}