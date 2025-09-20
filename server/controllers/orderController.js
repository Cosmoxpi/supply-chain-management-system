const Order = require("../models/Order");

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  const { product, quantity, status, route } = req.body;

  try {
    const newOrder = await Order.create({ product, quantity, status, route });
    res.status(201).json({ message: "Order created", order: newOrder });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
