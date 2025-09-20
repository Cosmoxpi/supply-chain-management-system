import React, { useEffect, useState } from "react";
import "./Inventory.css";

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [newItem, setNewItem] = useState({ product: "", stock: "", city: "" });

  // Fetch inventory from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
        setLoading(false);
      });
  }, []);

  // Handle input changes in form
  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Add new item (connected to backend)
  const handleAddItem = async () => {
    if (!newItem.product || !newItem.stock || !newItem.city) return;

    const newEntry = {
      product: newItem.product,
      stock: parseInt(newItem.stock),
      city: newItem.city,
    };

    try {
      const response = await fetch("http://localhost:5000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      const savedItem = await response.json();
      setInventory([...inventory, savedItem]);
      setNewItem({ product: "", stock: "", city: "" });
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // Delete item from backend and update local state
  const handleDelete = async (_id) => {
    try {
      await fetch(`http://localhost:5000/api/inventory/${_id}`, {
        method: "DELETE",
      });
      setInventory(inventory.filter((item) => item._id !== _id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Restock item and update backend + state
  const handleRestock = async (_id) => {
    const itemToRestock = inventory.find((item) => item._id === _id);
    if (!itemToRestock) return;

    const updatedStock = itemToRestock.stock + 100;

    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: updatedStock }),
      });

      if (!response.ok) {
        throw new Error("Failed to update stock");
      }

      const updatedItem = await response.json();

      const updatedInventory = inventory.map((item) =>
        item._id === _id ? updatedItem : item
      );
      setInventory(updatedInventory);
    } catch (err) {
      console.error("Error restocking item:", err);
    }
  };

  // Filter logic
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock =
      stockFilter === "low" ? item.stock < 100 :
      stockFilter === "in" ? item.stock >= 100 :
      true;
    return matchesSearch && matchesStock;
  });

  // Summary
  const lowStockCount = inventory.filter((item) => item.stock < 100).length;
  const totalStock = inventory.reduce((acc, item) => acc + item.stock, 0);

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div className="inventory-page">
      <h2>📦 Inventory</h2>

      <form className="add-form" onSubmit={(e) => { e.preventDefault(); handleAddItem(); }}>
        <input
          type="text"
          name="product"
          placeholder="Product Name"
          value={newItem.product}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={newItem.stock}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={newItem.city}
          onChange={handleInputChange}
        />
        <button type="submit">Add Item</button>
      </form>

      <div className="inventory-summary">
        <div className="summary-card">Total Products: {inventory.length}</div>
        <div className="summary-card low">Low Stock: {lowStockCount}</div>
        <div className="summary-card">Total Stock: {totalStock}</div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search product..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="in">In Stock (100+)</option>
          <option value="low">Low Stock (&lt;100)</option>
        </select>
      </div>

      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>City</th>
              <th>Alert</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item._id} className={item.stock < 100 ? "low-stock" : ""}>
                <td>{item.product}</td>
                <td>{item.stock}</td>
                <td>{item.city}</td>
                <td>
                  {item.stock < 100 && (
                    <>
                      <span className="alert-badge">Low</span>
                      <button onClick={() => handleRestock(item._id)}>Restock +100</button>
                    </>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{ backgroundColor: "#dc3545" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryPage;
