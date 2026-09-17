import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    // Customer must be logged in
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "You must be logged in to view this order.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "Invalid order ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // IMPORTANT:
    // Only return the order if it belongs to the logged-in customer.
    const order = await Order.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order details API error:", error);

    return NextResponse.json(
      {
        error: "Unable to load order.",
      },
      { status: 500 }
    );
  }
}