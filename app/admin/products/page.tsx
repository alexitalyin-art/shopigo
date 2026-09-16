"use client";

import { FormEvent, useState } from "react";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "",
    sizes: "",
    colors: "",
    stock: "",
    sku: "",
    isActive: true,
    isFeatured: false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          price: Number(form.price),
          compareAtPrice: form.compareAtPrice
            ? Number(form.compareAtPrice)
            : undefined,
          category: form.category,
          sizes: form.sizes
            .split(",")
            .map((size) => size.trim())
            .filter(Boolean),
          colors: form.colors
            .split(",")
            .map((color) => color.trim())
            .filter(Boolean),
          stock: Number(form.stock),
          sku: form.sku || undefined,
          isActive: form.isActive,
          isFeatured: form.isFeatured,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product.");
      }

      setMessage("Product added successfully!");

      setForm({
        name: "",
        slug: "",
        description: "",
        price: "",
        compareAtPrice: "",
        category: "",
        sizes: "",
        colors: "",
        stock: "",
        sku: "",
        isActive: true,
        isFeatured: false,
      });
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Shopigo Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Add Product
          </h1>

          <p className="mt-3 text-gray-600">
            Add a new product to your Shopigo store.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">

            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Product Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Men's Boot Cut Jeans"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Slug
              </label>

              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                placeholder="mens-boot-cut-jeans"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />

              <p className="mt-2 text-xs text-gray-500">
                Example: mens-boot-cut-jeans
              </p>
            </div>

            {/* SKU */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                SKU
              </label>

              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="SJ-001"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe the product..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Selling Price (₹)
              </label>

              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                type="number"
                min="0"
                placeholder="999"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Compare Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Compare-at Price (₹)
              </label>

              <input
                name="compareAtPrice"
                value={form.compareAtPrice}
                onChange={handleChange}
                type="number"
                min="0"
                placeholder="1299"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
              >
                <option value="">Select category</option>
                <option value="men">Men</option>
                <option value="jackets">Jackets</option>
                <option value="casual-wear">Casual Wear</option>
                <option value="new-arrivals">New Arrivals</option>
              </select>
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Stock
              </label>

              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                type="number"
                min="0"
                placeholder="50"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Sizes */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Sizes
              </label>

              <input
                name="sizes"
                value={form.sizes}
                onChange={handleChange}
                placeholder="30, 32, 34, 36"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />

              <p className="mt-2 text-xs text-gray-500">
                Separate sizes with commas.
              </p>
            </div>

            {/* Colors */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Colors
              </label>

              <input
                name="colors"
                value={form.colors}
                onChange={handleChange}
                placeholder="Blue, Black"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />

              <p className="mt-2 text-xs text-gray-500">
                Separate colors with commas.
              </p>
            </div>

            {/* Active */}
            <div className="md:col-span-2 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row">
              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                Product is active
              </label>

              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                Featured product
              </label>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mt-6 rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium">
              {message}
            </div>
          )}

          {/* Submit */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}