"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await fetch("/api/products");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load products.");
      }

      setProducts(data.products);
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product.");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== id)
      );

      setMessage("Product deleted successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete product."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Shopigo Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Products
            </h1>

            <p className="mt-3 text-gray-600">
              Manage your Shopigo product catalog.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="w-fit rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            + Add Product
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className="mt-8 rounded-lg bg-white px-4 py-3 text-sm font-medium shadow-sm">
            {message}
          </div>
        )}

        {/* Products */}
        <section className="mt-10">
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-500">
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <h2 className="text-xl font-semibold">
                No products found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add your first product to get started.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
              >
                Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Product
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Price
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Stock
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">

                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {product.slug}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm">
                          ₹{product.price.toLocaleString("en-IN")}
                        </td>

                        <td className="px-6 py-5 text-sm capitalize">
                          {product.category.replace("-", " ")}
                        </td>

                        <td className="px-6 py-5 text-sm">
                          {product.stock}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              product.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {product.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/products/${product._id}/edit`}
                              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:border-black hover:bg-black hover:text-white"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                deleteProduct(product._id)
                              }
                              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-gray-200 md:hidden">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {product.category.replace("-", " ")}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Stock: {product.stock}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            deleteProduct(product._id)
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </section>
      </div>
    </main>
  );
}