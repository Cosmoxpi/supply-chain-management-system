import React, { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    // Make sure to update the URL if you deploy to production
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = orders.filter((order) => {
      const matchSearch =
        order.product.toLowerCase().includes(search.toLowerCase()) ||
        order.route.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchSearch && matchStatus;
    });
    setFilteredOrders(filtered);
  }, [search, statusFilter, orders]);

  const statusColors = {
    Pending: "#facc15",
    Shipped: "#60a5fa",
    Delivered: "#4ade80",
    Cancelled: "#f87171",
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-page">
      <h2>📦 Orders</h2>

      <div className="orders-controls">
        <input
          type="text"
          placeholder="Search by product or route"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="order-summary">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Route</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.product}</td>
                <td>{order.route}</td>
                <td>{order.quantity}</td>
                <td>
                  <span
                    className="status-tag"
                    style={{ backgroundColor: statusColors[order.status] }}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
