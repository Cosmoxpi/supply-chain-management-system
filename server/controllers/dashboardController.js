const Inventory = require("../models/Inventory");
const Order = require("../models/Order");

exports.getDashboardData = async (req, res) => {
  try {
    const totalInventory = await Inventory.countDocuments();

    // Low stock is defined as stock less than 100
    const lowStock = await Inventory.countDocuments({ stock: { $lt: 100 } });

    const totalOrders = await Order.countDocuments();
    const ordersInTransit = await Order.countDocuments({ status: "shipped" });
    const delayedOrders = await Order.countDocuments({ status: "cancelled" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    const averageETA = 45;
    const criticalDelayed = 5;

    const metrics = {
      totalInventory,
      lowStock,
      totalOrders,
      ordersInTransit,
      delayedOrders,
      deliveredOrders,
      averageETA,
      criticalDelayed,
    };

    const trends = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Fetching inventory data for the frontend
    const inventoryData = await Inventory.find(); // Fetch inventory data

    res.json({ metrics, trends, inventoryData });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
