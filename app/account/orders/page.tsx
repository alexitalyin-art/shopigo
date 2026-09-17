"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

type OrderItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  productTotal: number;
  shippingCharge: number;
  totalAmount: number;
  paymentMethod: "full" | "partial";
  advanceAmount: number;
  codAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders/my", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Unable to load your orders."
          );
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("My orders error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatStatus(status: string) {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-gray-900">
        <Header />

        <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Account
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              My Orders
            </h1>
          </div>

          <div className="rounded-2xl bg-gray-50 px-6 py-20 text-center">
            <p className="text-gray-600">
              Loading your orders...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white text-gray-900">
        <Header />

        <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Account
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              My Orders
            </h1>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            My Orders
          </h1>

          <p className="mt-4 text-gray-600">
            View and track your Shopigo orders.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 px-6 py-20 text-center">
            <h2 className="text-2xl font-semibold">
              You haven't placed any orders yet
            </h2>

            <p className="mt-3 text-gray-600">
              Your orders will appear here after you place
              your first order.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-200"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-semibold">
                      #{order._id}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-medium">
                        Order: {formatStatus(order.orderStatus)}
                    </span>

                    <span className="rounded-full bg-white px-4 py-2 text-sm font-medium">
                        Payment: {formatStatus(order.paymentStatus)}
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="p-6">
                  <div className="space-y-5">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${item.productId}-${index}`}
                        className="flex gap-4"
                      >
                        {/* Product Image */}
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Product Information */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-600">
                            ₹
                            {item.price.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                            <span>
                              Qty: {item.quantity}
                            </span>

                            {item.size && (
                              <span>
                                Size: {item.size}
                              </span>
                            )}

                            {item.color && (
                              <span>
                                Color: {item.color}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Summary */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Product Total
                        </span>

                        <span className="font-medium">
                          ₹
                          {order.productTotal.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Delivery
                        </span>

                        <span className="font-medium">
                          {order.shippingCharge === 0
                            ? "Free"
                            : `₹${order.shippingCharge.toLocaleString(
                                "en-IN"
                              )}`}
                        </span>
                      </div>

                      <div className="flex justify-between border-t border-gray-200 pt-3">
                        <span className="font-bold">
                          Total
                        </span>

                        <span className="font-bold">
                          ₹
                          {order.totalAmount.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-6 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm font-semibold">
                      Payment
                    </p>

                    {order.paymentMethod === "full" ? (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          Full online payment: ₹
                          {order.advanceAmount.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>
                          Advance paid online: ₹
                          {order.advanceAmount.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p>
                          Remaining COD: ₹
                          {order.codAmount.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Details Button */}
                  <div className="mt-6">
                    <Link
                      href={`/account/orders/${order._id}`}
                      className="inline-block rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold transition hover:bg-gray-100"
                    >
                      View Order Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}