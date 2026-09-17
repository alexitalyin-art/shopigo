"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useCart } from "@/components/cart/CartProvider";

type ProductStock = {
  _id: string;
  stock: number;
};

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [loadingStock, setLoadingStock] = useState(true);

  useEffect(() => {
    async function fetchStock() {
      if (items.length === 0) {
        setStockMap({});
        setLoadingStock(false);
        return;
      }

      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const products: ProductStock[] = data.products || [];

        const newStockMap: Record<string, number> = {};

        products.forEach((product) => {
        newStockMap[product._id] = product.stock;
      });

        

        setStockMap(newStockMap);
      } catch (error) {
        console.error("Failed to load product stock:", error);
      } finally {
        setLoadingStock(false);
      }
    }

    fetchStock();
  }, [items.length]);

  function handleIncrease(
    productId: string,
    currentQuantity: number,
    size?: string,
    color?: string
  ) {
    const availableStock = stockMap[productId];

    if (availableStock === undefined) {
      return;
    }

    if (currentQuantity >= availableStock) {
      alert("You cannot add more than the available stock.");
      return;
    }

    updateQuantity(
      productId,
      currentQuantity + 1,
      size,
      color
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Shopping Cart
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-gray-50 px-6 py-20 text-center">
            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-600">
              Add some products to your cart to get started.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-5">
              {items.map((item) => {
                const availableStock = stockMap[item.productId];
                const stockLimitReached =
                  availableStock !== undefined &&
                  item.quantity >= availableStock;

                const productOutOfStock =
                  availableStock !== undefined &&
                  availableStock <= 0;

                return (
                  <article
                    key={`${item.productId}-${item.size || ""}-${item.color || ""}`}
                    className="flex gap-5 rounded-2xl border border-gray-200 p-5"
                  >
                    <Link
                      href={`/shop/${item.slug}`}
                      className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">
                          No Image
                        </span>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link
                            href={`/shop/${item.slug}`}
                            className="font-semibold hover:underline"
                          >
                            {item.name}
                          </Link>

                          {item.size && (
                            <p className="mt-1 text-sm text-gray-500">
                              Size: {item.size}
                            </p>
                          )}

                          {item.color && (
                            <p className="text-sm text-gray-500">
                              Color: {item.color}
                            </p>
                          )}

                          {!loadingStock &&
                            productOutOfStock && (
                              <p className="mt-2 text-sm font-medium text-red-600">
                                Out of Stock
                              </p>
                            )}

                          {!loadingStock &&
                            !productOutOfStock &&
                            stockLimitReached && (
                              <p className="mt-2 text-sm font-medium text-orange-600">
                                Stock limit reached
                              </p>
                            )}
                        </div>

                        <p className="font-semibold">
                          ₹
                          {(
                            item.price * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-5">
                        <div className="flex items-center rounded-lg border border-gray-300">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.size,
                                item.color
                              )
                            }
                            className="px-3 py-2 text-lg hover:bg-gray-100"
                          >
                            −
                          </button>

                          <span className="min-w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleIncrease(
                                item.productId,
                                item.quantity,
                                item.size,
                                item.color
                              )
                            }
                            disabled={
                              loadingStock ||
                              productOutOfStock ||
                              stockLimitReached
                            }
                            className="px-3 py-2 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.productId,
                              item.size,
                              item.color
                            )
                          }
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-2xl bg-gray-50 p-6">
              <h2 className="text-xl font-bold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 border-b border-gray-200 pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Items
                  </span>

                  <span className="font-medium">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-medium">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Delivery
                  </span>

                  <span className="font-medium">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <span className="text-lg font-bold">
                  Total
                </span>

                <span className="text-lg font-bold">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Proceed to Checkout

              </Link>

              <Link
                href="/shop"
                className="mt-4 block text-center text-sm font-medium text-gray-600 hover:text-black"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
} 