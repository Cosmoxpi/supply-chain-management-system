// routes/tracking.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // MongoDB Order model

// Map cities to coordinates (for now, we are using static city data)
const cityCoordinates = {
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Bangalore: { lat: 12.9716, lng: 77.5946 }, // for route with "Bangalore"
  Hyderabad: { lat: 17.3850, lng: 78.4867 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Surat: { lat: 21.1702, lng: 72.8311 },
  Nashik: { lat: 19.9975, lng: 73.7898 },
  Coimbatore: { lat: 11.0168, lng: 76.9558 },
  Gurgaon: { lat: 28.4595, lng: 77.0266 },
  Noida: { lat: 28.5355, lng: 77.3910 }
};

// GET /api/tracking/:orderId
router.get("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const [originCity, destinationCity] = order.route.split(" to ");
    const origin = cityCoordinates[originCity.trim()];
    const destination = cityCoordinates[destinationCity.trim()];

    if (!origin || !destination) {
      return res.status(400).json({ error: "Invalid route in order" });
    }

    const trackingData = {
      id: order._id,
      product: order.product,
      status: order.status,
      origin,
      destination,
      currentLocation: origin, // Currently static, could be updated dynamically
      eta: order.eta || "2025-04-20T18:30:00Z", // Static ETA, can be enhanced later
    };

    res.json(trackingData);
  } catch (error) {
    console.error("Tracking error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/tracking
// Fetches all orders with tracking info
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    const trackingData = orders.map((order) => {
      const [originCity, destinationCity] = order.route.split(" to ");
      const origin = cityCoordinates[originCity.trim()];
      const destination = cityCoordinates[destinationCity.trim()];

      return {
        id: order._id,
        product: order.product,
        status: order.status,
        origin,
        destination,
        currentLocation: origin, // Static for now, you can modify it later
        eta: order.eta, // Can be stored in order schema
      };
    });

    res.json(trackingData);
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
