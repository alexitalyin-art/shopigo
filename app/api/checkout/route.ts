import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

const ADVANCE_PERCENTAGE = 10;

type CheckoutItem = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
};

type PaymentMethod = "full" | "partial";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const items: CheckoutItem[] = body.items;
    const paymentMethod: PaymentMethod = body.paymentMethod;

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

    await connectDB();

    const productIds = items.map((item) => item.productId);

    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    }).lean();

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "One or more products are no longer available." },
        { status: 400 }
      );
    }

    let totalPrice = 0;

    const validatedItems = [];

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid product quantity." },
          { status: 400 }
        );
      }

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

      totalPrice += itemTotal;

      validatedItems.push({
        productId: product._id.toString(),
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
        itemTotal,
      });
    }

    let advanceAmount = 0;
    let remainingCodAmount = 0;

    if (paymentMethod === "full") {
      advanceAmount = totalPrice;
      remainingCodAmount = 0;
    } else {
      advanceAmount = Math.round(
        (totalPrice * ADVANCE_PERCENTAGE) / 100
      );

      remainingCodAmount = totalPrice - advanceAmount;
    }

    return NextResponse.json({
      success: true,

      payment: {
        method: paymentMethod,
        totalPrice,
        advancePercentage:
          paymentMethod === "partial"
            ? ADVANCE_PERCENTAGE
            : 100,
        advanceAmount,
        remainingCodAmount,
      },

      items: validatedItems,
    });
  } catch (error) {
    console.error("Checkout API error:", error);

    return NextResponse.json(
      { error: "Unable to process checkout." },
      { status: 500 }
    );
  }
}