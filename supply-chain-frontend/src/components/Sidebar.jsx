import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaChartBar, FaBox, FaTruck, FaClipboardList } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true); // Sidebar open by default

    return (
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            <ul>
                <li>
                    <Link to="/">
                        <FaChartBar className="icon" />
                        {isOpen && <span>Dashboard</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/orders">
                        <FaClipboardList className="icon" />
                        {isOpen && <span>Orders</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/inventory">
                        <FaBox className="icon" />
                        {isOpen && <span>Inventory</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/tracking">
                        <FaTruck className="icon" />
                        {isOpen && <span>Tracking</span>}
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
