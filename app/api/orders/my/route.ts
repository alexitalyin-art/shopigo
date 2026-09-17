import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to view your orders." },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("My orders API error:", error);

    return NextResponse.json(
      {
        error: "Unable to load your orders.",
      },
      { status: 500 }
    );
  }
}