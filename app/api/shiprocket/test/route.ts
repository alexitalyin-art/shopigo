import { NextResponse } from "next/server";
import { getShiprocketToken } from "@/lib/shiprocket";

export async function GET() {
  try {
    await getShiprocketToken();

    return NextResponse.json({
      success: true,
      message: "Shopigo successfully authenticated with Shiprocket.",
    });
  } catch (error) {
    console.error("Shiprocket test error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Shiprocket authentication failed.",
      },
      { status: 500 }
    );
  }
}