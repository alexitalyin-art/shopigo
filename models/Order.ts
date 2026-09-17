import mongoose, { Model, Schema } from "mongoose";

export type OrderItem = {
  productId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type OrderDocument = {
  userId?: mongoose.Types.ObjectId;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  productTotal: number;
  shippingCharge: number;
  totalAmount: number;

  paymentMethod: "full" | "partial";
  advanceAmount: number;
  codAmount: number;

  paymentStatus:
    | "pending"
    | "advance_paid"
    | "paid"
    | "failed"
    | "refunded";

  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";

  razorpayOrderId?: string;
  razorpayPaymentId?: string;

  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  shiprocketAwbCode?: string;
  shiprocketCourierName?: string;

  createdAt: Date;
  updatedAt: Date;
};

const OrderItemSchema = new Schema<OrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    size: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<ShippingAddress>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: OrderItem[]) => items.length > 0,
        message: "Order must contain at least one item.",
      },
    },

    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },

    productTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingCharge: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["full", "partial"],
      required: true,
    },

    advanceAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    codAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "advance_paid",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },

    razorpayOrderId: {
      type: String,
      trim: true,
    },

    razorpayPaymentId: {
      type: String,
      trim: true,
    },

    shiprocketOrderId: {
      type: String,
      trim: true,
    },

    shiprocketShipmentId: {
      type: String,
      trim: true,
    },

    shiprocketAwbCode: {
      type: String,
      trim: true,
    },

    shiprocketCourierName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<OrderDocument> =
  mongoose.models.Order ||
  mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;