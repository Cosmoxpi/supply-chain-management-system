const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  route: { type: String, required: true }, // e.g., "Delhi-Mumbai"
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
