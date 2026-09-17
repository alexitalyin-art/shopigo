"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Header from "@/components/Header";
import { useCart } from "@/components/cart/CartProvider";

type CheckoutResponse = {
  success: boolean;
  payment: {
    method?: "full" | "partial";
    totalPrice: number;
    advancePercentage: number;
    advanceAmount: number;
    remainingCodAmount: number;
  };
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    price: number;
    image?: string;
    quantity: number;
    size?: string;
    color?: string;
    itemTotal: number;
  }>;
  error?: string;
};

type OrderResponse = {
  success: boolean;
  order?: {
    id: string;
    productTotal: number;
    shippingCharge: number;
    totalAmount: number;
    paymentMethod: "full" | "partial";
    advanceAmount: number;
    codAmount: number;
    paymentStatus: string;
    orderStatus: string;
  };
  error?: string;
};

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<
    "full" | "partial"
  >("partial");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [validatedPayment, setValidatedPayment] =
    useState<CheckoutResponse["payment"] | null>(null);

  const [createdOrder, setCreatedOrder] =
    useState<OrderResponse["order"] | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setValidatedPayment(null);
    setCreatedOrder(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      /*
       * STEP 1
       * Securely validate current prices, stock and variants.
       */
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        }),
      });

      const checkoutData: CheckoutResponse =
        await checkoutResponse.json();

      if (!checkoutResponse.ok || !checkoutData.success) {
        throw new Error(
          checkoutData.error || "Unable to validate checkout."
        );
      }

      setValidatedPayment(checkoutData.payment);

      /*
       * STEP 2
       * Create the actual order using the server.
       */
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,

          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),

          shippingAddress: {
            fullName: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
          },
        }),
      });

      const orderData: OrderResponse =
        await orderResponse.json();

      if (!orderResponse.ok || !orderData.success || !orderData.order) {
        throw new Error(
          orderData.error || "Unable to create your order."
        );
      }

      setCreatedOrder(orderData.order);

      /*
       * The order has now been created successfully.
       *
       * We can clear the cart because the server has created
       * the order successfully.
       */
      clearCart();
    } catch (error) {
      console.error("Order creation error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your order."
      );
    } finally {
      setLoading(false);
    }
  }

  const displayTotal =
    validatedPayment?.totalPrice ?? totalPrice;

  const advanceAmount =
    validatedPayment?.advanceAmount ??
    Math.round((displayTotal * 10) / 100);

  const remainingCodAmount =
    validatedPayment?.remainingCodAmount ??
    displayTotal - advanceAmount;

  /*
   * Order successfully created
   */
  if (createdOrder) {
    return (
      <main className="min-h-screen bg-white text-gray-900">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center md:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
              ✓
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-700">
              Order Created
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Your order has been placed
            </h1>

            <p className="mt-4 text-gray-700">
              Your order has been successfully created.
              Payment processing will be connected next.
            </p>

            <div className="mt-8 rounded-2xl bg-white p-6 text-left">
              <div className="flex justify-between gap-4 border-b border-gray-200 pb-4">
                <span className="text-gray-600">
                  Order ID
                </span>

                <span className="max-w-[220px] break-all text-right font-semibold">
                  {createdOrder.id}
                </span>
              </div>

              <div className="flex justify-between py-4">
                <span className="text-gray-600">
                  Total
                </span>

                <span className="font-semibold">
                  ₹
                  {createdOrder.totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-gray-600">
                  Payment Method
                </span>

                <span className="font-semibold">
                  {createdOrder.paymentMethod === "full"
                    ? "Full Online Payment"
                    : "10% Advance + COD"}
                </span>
              </div>

              {createdOrder.paymentMethod === "partial" && (
                <>
                  <div className="mt-4 flex justify-between">
                    <span className="text-gray-600">
                      Advance
                    </span>

                    <span className="font-semibold">
                      ₹
                      {createdOrder.advanceAmount.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="text-gray-600">
                      Remaining COD
                    </span>

                    <span className="font-semibold">
                      ₹
                      {createdOrder.codAmount.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </>
              )}

              <div className="mt-4 flex justify-between">
                <span className="text-gray-600">
                  Order Status
                </span>

                <span className="font-semibold capitalize">
                  {createdOrder.orderStatus}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/shop"
                className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Continue Shopping
              </Link>

              <Link
                href="/account/orders"
                className="rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                View My Orders
              </Link>
            </div>
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
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Complete Your Order
          </h1>

          <p className="mt-4 text-gray-600">
            Enter your delivery details and choose your
            payment method.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 px-6 py-20 text-center">
            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-600">
              Add products to your cart before checking out.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-10 lg:grid-cols-[1fr_380px]"
          >
            {/* Delivery Information */}
            <div className="space-y-8">
              <section className="rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold">
                  Delivery Information
                </h2>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium"
                    >
                      Full Name
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(event.target.value)
                      }
                      required
                      disabled={loading}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      required
                      disabled={loading}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="text-sm font-medium"
                    >
                      Address
                    </label>

                    <textarea
                      id="address"
                      value={address}
                      onChange={(event) =>
                        setAddress(event.target.value)
                      }
                      required
                      disabled={loading}
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                      placeholder="House number, street, area"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="city"
                        className="text-sm font-medium"
                      >
                        City
                      </label>

                      <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(event) =>
                          setCity(event.target.value)
                        }
                        required
                        disabled={loading}
                        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="text-sm font-medium"
                      >
                        State
                      </label>

                      <input
                        id="state"
                        type="text"
                        value={state}
                        onChange={(event) =>
                          setState(event.target.value)
                        }
                        required
                        disabled={loading}
                        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                        placeholder="State"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pincode"
                        className="text-sm font-medium"
                      >
                        Pincode
                      </label>

                      <input
                        id="pincode"
                        type="text"
                        inputMode="numeric"
                        value={pincode}
                        onChange={(event) =>
                          setPincode(event.target.value)
                        }
                        required
                        disabled={loading}
                        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                        placeholder="Pincode"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold">
                  Payment Method
                </h2>

                <div className="mt-6 space-y-4">
                  {/* Full Payment */}
                  <label
                    className={`block cursor-pointer rounded-xl border p-5 transition ${
                      paymentMethod === "full"
                        ? "border-black bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="full"
                        checked={paymentMethod === "full"}
                        disabled={loading}
                        onChange={() => {
                          setPaymentMethod("full");
                          setValidatedPayment(null);
                        }}
                        className="mt-1"
                      />

                      <div>
                        <p className="font-semibold">
                          Pay Full Amount Online
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Pay ₹
                          {displayTotal.toLocaleString(
                            "en-IN"
                          )}{" "}
                          online.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Partial Payment */}
                  <label
                    className={`block cursor-pointer rounded-xl border p-5 transition ${
                      paymentMethod === "partial"
                        ? "border-black bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="partial"
                        checked={
                          paymentMethod === "partial"
                        }
                        disabled={loading}
                        onChange={() => {
                          setPaymentMethod("partial");
                          setValidatedPayment(null);
                        }}
                        className="mt-1"
                      />

                      <div>
                        <p className="font-semibold">
                          10% Advance + Remaining COD
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Pay ₹
                          {advanceAmount.toLocaleString(
                            "en-IN"
                          )}{" "}
                          online now.
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Remaining ₹
                          {remainingCodAmount.toLocaleString(
                            "en-IN"
                          )}{" "}
                          will be collected on delivery.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </section>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {validatedPayment && !createdOrder && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                  <p className="font-semibold text-green-800">
                    Checkout validated successfully.
                  </p>

                  <p className="mt-2 text-sm text-green-700">
                    The server confirmed the current product
                    prices, stock, and variants.
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-green-800">
                    <div className="flex justify-between">
                      <span>Total</span>

                      <span className="font-semibold">
                        ₹
                        {validatedPayment.totalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Advance</span>

                      <span className="font-semibold">
                        ₹
                        {validatedPayment.advanceAmount.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Remaining COD</span>

                      <span className="font-semibold">
                        ₹
                        {validatedPayment.remainingCodAmount.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating Order..."
                  : paymentMethod === "full"
                    ? "Create Order & Continue to Payment"
                    : "Create Order & Pay Advance"}
              </button>
            </div>

            {/* Order Summary */}
            <aside className="h-fit rounded-2xl bg-gray-50 p-6 lg:sticky lg:top-6">
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
                    ₹
                    {displayTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Delivery
                  </span>

                  <span className="font-medium">
                    Calculated later
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <span className="text-lg font-bold">
                  Total
                </span>

                <span className="text-lg font-bold">
                  ₹
                  {displayTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              {paymentMethod === "partial" && (
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Pay now
                    </span>

                    <span className="font-bold">
                      ₹
                      {advanceAmount.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-600">
                      Pay on delivery
                    </span>

                    <span className="font-bold">
                      ₹
                      {remainingCodAmount.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              )}
            </aside>
          </form>
        )}
      </section>
    </main>
  );
}