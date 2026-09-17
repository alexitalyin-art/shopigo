import { NextResponse } from "next/server";
import { auth } from "@/auth";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

const ADVANCE_PERCENTAGE = 10;

type OrderItemInput = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
};

type PaymentMethod = "full" | "partial";

type CreateOrderBody = {
  items: OrderItemInput[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: PaymentMethod;
};

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to place an order." },
        { status: 401 }
      );
    }

    const body: CreateOrderBody = await request.json();

    const { items, shippingAddress, paymentMethod } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    if (paymentMethod !== "full" && paymentMethod !== "partial") {
      return NextResponse.json(
        { error: "Invalid payment method." },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required." },
        { status: 400 }
      );
    }

    const requiredAddressFields = [
      "fullName",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ] as const;

    for (const field of requiredAddressFields) {
      if (
        typeof shippingAddress[field] !== "string" ||
        !shippingAddress[field].trim()
      ) {
        return NextResponse.json(
          { error: `${field} is required.` },
          { status: 400 }
        );
      }
    }

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return NextResponse.json(
          { error: "Invalid product ID." },
          { status: 400 }
        );
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid product quantity." },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const productIds = items.map((item) => item.productId);

    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    }).lean();

    if (products.length !== items.length) {
      return NextResponse.json(
        {
          error:
            "One or more products are no longer available.",
        },
        { status: 400 }
      );
    }

    let productTotal = 0;

    const validatedItems = [];

    for (const item of items) {
      const product = products.find(
        (currentProduct) =>
          currentProduct._id.toString() === item.productId
      );

      if (!product) {
        return NextResponse.json(
          { error: "Product not found." },
          { status: 400 }
        );
      }

      if (product.stock <= 0) {
        return NextResponse.json(
          {
            error: `${product.name} is out of stock.`,
          },
          { status: 400 }
        );
      }

      if (item.quantity > product.stock) {
        return NextResponse.json(
          {
            error: `Only ${product.stock} unit(s) of ${product.name} are available.`,
          },
          { status: 400 }
        );
      }

      if (
        product.sizes.length > 0 &&
        (!item.size || !product.sizes.includes(item.size))
      ) {
        return NextResponse.json(
          {
            error: `Please select a valid size for ${product.name}.`,
          },
          { status: 400 }
        );
      }

      if (
        product.colors.length > 0 &&
        (!item.color || !product.colors.includes(item.color))
      ) {
        return NextResponse.json(
          {
            error: `Please select a valid color for ${product.name}.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;

      productTotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : undefined,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });
    }

    // Shipping is temporarily zero.
    // Shiprocket will provide the real shipping charge later.
    const shippingCharge = 0;

    const totalAmount = productTotal + shippingCharge;

    let advanceAmount = 0;
    let codAmount = 0;

    if (paymentMethod === "full") {
      advanceAmount = totalAmount;
      codAmount = 0;
    } else {
      advanceAmount = Math.round(
        (totalAmount * ADVANCE_PERCENTAGE) / 100
      );

      codAmount = totalAmount - advanceAmount;
    }

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(session.user.id),

      items: validatedItems,

      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
      },

      productTotal,
      shippingCharge,
      totalAmount,

      paymentMethod,
      advanceAmount,
      codAmount,

      paymentStatus: "pending",
      orderStatus: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully.",

        order: {
          id: order._id.toString(),
          productTotal: order.productTotal,
          shippingCharge: order.shippingCharge,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          advanceAmount: order.advanceAmount,
          codAmount: order.codAmount,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        error: "Unable to create order.",
      },
      { status: 500 }
    );
  }
}