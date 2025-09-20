const Inventory = require("../models/Inventory");

// GET all inventory items
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add a new item
const addInventoryItem = async (req, res) => {
  const { product, stock, city } = req.body;
  try {
    const newItem = await Inventory.create({ product, stock, city });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH: Update stock by ID (for restocking or changes)
const updateStock = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const item = await Inventory.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Allow restocking (increment) or direct update
    item.stock = typeof stock === "number" ? stock : item.stock;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE item by ID
const deleteInventoryItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Inventory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getInventory,
  addInventoryItem,
  updateStock,
  deleteInventoryItem,
};
