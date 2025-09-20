const express = require("express");
const router = express.Router();

const {
  getInventory,
  addInventoryItem,
  updateStock,
  deleteInventoryItem,
} = require("../controllers/inventoryController");

// Get all inventory items
router.get("/", getInventory);

// Add a new inventory item
router.post("/", addInventoryItem);

// Update stock of an inventory item (PATCH for partial updates like restocking)
router.patch("/:id", updateStock);

// Delete an inventory item
router.delete("/:id", deleteInventoryItem);

module.exports = router;
