import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Charts = ({ trends, inventoryData }) => {
  // Prepare shipments data from trends
  const shipmentsData = trends || [];

  // Filter low stock items (stock < 100)
  const lowStockData = inventoryData.filter(item => item.stock < 100);

  // Pie chart colors for low stock items
  const COLORS = ['#FF8042', '#0088FE'];

  return (
    <div className="charts-grid">
      {/* 📦 Inventory Stock Levels Bar Chart */}
      <div className="chart-card">
        <h3>📦 Inventory Stock Levels</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#82ca9d" name="Stock" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🚨 Low Stock Pie Chart */}
      <div className="chart-card">
        <h3>🚨 Low Stock Items</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "Low Stock", value: lowStockData.length },
                { name: "Normal Stock", value: inventoryData.length - lowStockData.length }
              ]}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {[<Cell key="low-stock" fill={COLORS[0]} />, <Cell key="normal-stock" fill={COLORS[1]} />]}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 📦 Orders by Status (Bar Chart) */}
      <div className="chart-card">
        <h3>📦 Orders by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={shipmentsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
