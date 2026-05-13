import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [100, "Name is too long"],
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["PENDING", "CANCELLED","COMPLETED"],
      default: "PENDING",
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "CARD", "UPI", "NETBANKING","ONLINE"],
      required: [true, "Payment method is required"],
    },

    product: {
      type: String,
      required: [true, "Product is required"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;