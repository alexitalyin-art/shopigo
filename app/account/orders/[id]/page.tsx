"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
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

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/orders/${orderId}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load order.");
        }

        setOrder(data.order);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-gray-600">Loading order...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Order not found
            </h1>

            <p className="mt-3 text-gray-600">
              {error || "We could not find this order."}
            </p>

            <Link
              href="/account/orders"
              className="mt-6 inline-block rounded-xl bg-black px-5 py-3 font-medium text-white"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/account/orders"
          className="mb-6 inline-block text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to My Orders
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>

              <h1 className="mt-1 break-all text-xl font-bold text-gray-900">
                #{order._id}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium capitalize">
                Order: {formatStatus(order.orderStatus)}
              </span>

              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium capitalize">
                Payment: {formatStatus(order.paymentStatus)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Products */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Order Items
              </h2>

              <div className="space-y-5">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex gap-4 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                  >
                    {/* Image */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        ₹{item.price.toLocaleString("en-IN")} ×{" "}
                        {item.quantity}
                      </p>

                      {item.size && (
                        <p className="mt-1 text-sm text-gray-600">
                          Size: {item.size}
                        </p>
                      )}

                      {item.color && (
                        <p className="text-sm text-gray-600">
                          Color: {item.color}
                        </p>
                      )}

                      <p className="mt-2 font-semibold text-gray-900">
                        ₹
                        {(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Summary */}
          <section>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Products</span>

                  <span className="font-medium">
                    ₹{order.productTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Shipping</span>

                  <span className="font-medium">
                    {order.shippingCharge === 0
                      ? "Free"
                      : `₹${order.shippingCharge.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between gap-4 text-base">
                    <span className="font-semibold">Total</span>

                    <span className="font-bold">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">
                  Payment Details
                </h3>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">Method</span>

                    <span className="font-medium capitalize">
                      {order.paymentMethod === "full"
                        ? "Full Payment"
                        : "10% Advance + COD"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">Advance</span>

                    <span className="font-medium">
                      ₹{order.advanceAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">Remaining COD</span>

                    <span className="font-medium">
                      ₹{order.codAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Delivery Address
              </h2>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p className="font-semibold text-gray-900">
                  {order.shippingAddress.fullName}
                </p>

                <p>{order.shippingAddress.phone}</p>

                <p>{order.shippingAddress.address}</p>

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}
                </p>

                <p>PIN: {order.shippingAddress.pincode}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}