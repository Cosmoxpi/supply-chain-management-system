import React, { useEffect, useState } from "react";
import Charts from "../components/Charts";
import "./Dashboard.css";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [inventoryData, setInventoryData] = useState(null); // For inventory data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard/dashboard"); // Fetch data from backend
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setMetrics(data.metrics);  // Set metrics for totals like inventory, orders, etc.
        setTrends(data.trends);    // Set order trends data
        setInventoryData(data.inventoryData); // Set inventory data
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>

      {/* 📦 Metrics Section */}
      <div className="dashboard-content">
        {metrics ? (
          <>
            <div className="metric-card">📦 Total Inventory: {metrics.totalInventory}</div>
            <div className="metric-card">🚨 Low Stock: {metrics.lowStock}</div>
            <div className="metric-card">📦 Total Orders: {metrics.totalOrders}</div>
            <div className="metric-card">🚚 In Transit: {metrics.ordersInTransit}</div>
            <div className="metric-card">⌛ Delayed: {metrics.delayedOrders}</div>
            <div className="metric-card">✅ Delivered: {metrics.deliveredOrders}</div>
            <div className="metric-card">⏱️ Avg ETA: {metrics.averageETA} mins</div>
            <div className="metric-card">🚨 Critical Delays: {metrics.criticalDelayed}</div>
          </>
        ) : (
          <p>No metrics available.</p>
        )}
      </div>

      {/* 📉 Charts Section */}
      <div className="dashboard-charts">
        {trends && inventoryData ? (
          <Charts trends={trends} inventoryData={inventoryData} />
        ) : (
          <p>Loading charts...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
