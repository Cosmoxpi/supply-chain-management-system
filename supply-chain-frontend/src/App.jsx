import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Tracking from "./pages/Tracking";
import HomePage from "./pages/HomePage";

import "./App.css";
import "./components/Sidebar.css";
import "./pages/Tracking.css";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} /> { }
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/tracking" element={<Tracking />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
