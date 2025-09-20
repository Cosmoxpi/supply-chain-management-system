import React from "react";
import { Link } from "react-router-dom";
import { FaTruck, FaBoxOpen, FaChartBar, FaClipboardList } from "react-icons/fa";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-text">
          <h1>📦 SupplyLink: Smart Supply Chain System</h1>
          <p>
            Your all-in-one solution to manage inventory, orders, and logistics with real-time visibility.
          </p>
          <div className="home-buttons">
            <Link to="/dashboard" className="btn primary">📊 Dashboard</Link>
            <Link to="/orders" className="btn secondary">📋 Manage Orders</Link>
            
            

          </div>
        </div>
        <div className="home-cards">
          <div className="feature-card">
            <FaChartBar className="icon" />
            <h3>Analytics</h3>
            <p>Get real-time insights on shipment delays and performance.</p>
          </div>
          <div className="feature-card">
            <FaClipboardList className="icon" />
            <h3>Orders</h3>
            <p>Track and manage orders across all routes and locations.</p>
          </div>
          <div className="feature-card">
            <FaBoxOpen className="icon" />
            <h3>Inventory</h3>
            <p>Monitor stock levels and receive alerts when running low.</p>
          </div>
          <div className="feature-card">
            <FaTruck className="icon" />
            <h3>Live Tracking</h3>
            <p>Follow shipments live across regions and optimize logistics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
