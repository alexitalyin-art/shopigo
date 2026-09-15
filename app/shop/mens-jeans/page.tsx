import Header from "@/components/Header";
import Button from "@/components/ui/Button";

const sizes = ["30", "32", "34", "36"];

export default function MensJeansPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Product Details */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-2">

          {/* Product Image */}
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
            <span className="text-sm text-gray-400">
              Product Image
            </span>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            {/* Category */}
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Men's Collection
            </p>

            {/* Product Name */}
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Men's Jeans
            </h1>

            {/* Price */}
            <p className="mt-6 text-2xl font-semibold">
              ₹999
            </p>

            {/* Description */}
            <p className="mt-6 max-w-xl leading-7 text-gray-600">
              Comfortable and stylish men's jeans designed for everyday wear.
              Perfect for casual outfits, daily use, and versatile styling.
            </p>

            {/* Size Selection */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  Select Size
                </h2>

                <button
                  type="button"
                  className="text-sm text-gray-500 underline hover:text-black"
                >
                  Size Guide
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-3">
                {sizes.map((size) => (
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

            {/* Quantity */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold">
                Quantity
              </h2>

              <div className="mt-3 flex w-fit items-center rounded-lg border border-gray-300">
                <button
                  type="button"
                  className="px-4 py-3 text-lg hover:bg-gray-100"
                >
                  −
                </button>

                <span className="px-5 text-sm font-medium">
                  1
                </span>

                <button
                  type="button"
                  className="px-4 py-3 text-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
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

            {/* Product Information */}
            <div className="mt-10 border-t border-gray-200 pt-6">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-4">
                  <span className="text-gray-500">
                    Material
                  </span>

                  <span className="font-medium">
                    Denim
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-100 pb-4">
                  <span className="text-gray-500">
                    Fit
                  </span>

                  <span className="font-medium">
                    Regular Fit
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Availability
                  </span>

                  <span className="font-medium text-green-600">
                    In Stock
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