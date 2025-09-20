import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Tracking.css";

const STATUS = {
  PENDING: "Pending",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

const Tracking = () => {
  const [shipments, setShipments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tracking");
        const data = await res.json();
        // Initialize history paths
        const enriched = data.map((shipment) => ({
          ...shipment,
          history: [shipment.currentLocation],
          eta: calculateETA(shipment),
        }));
        setShipments(enriched);
      } catch (error) {
        console.error("Error fetching shipments:", error);
      }
    };

    fetchShipments();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShipments((prev) =>
        prev.map((shipment) => {
          if (shipment.status === STATUS.DELIVERED) return shipment;

          const { lat: lat1, lng: lng1 } = shipment.currentLocation;
          const { lat: lat2, lng: lng2 } = shipment.destination;

          const deltaLat = lat2 - lat1;
          const deltaLng = lng2 - lng1;
          const step = 0.01;

          const newLat = lat1 + deltaLat * step;
          const newLng = lng1 + deltaLng * step;

          const reached = Math.abs(newLat - lat2) < 0.01 && Math.abs(newLng - lng2) < 0.01;

          const newStatus = reached ? STATUS.DELIVERED : shipment.status;
          const newLocation = reached ? shipment.destination : { lat: newLat, lng: newLng };

          const updatedHistory = [...shipment.history, newLocation];

          return {
            ...shipment,
            currentLocation: newLocation,
            status: newStatus,
            eta: calculateETA({ ...shipment, currentLocation: newLocation }),
            history: updatedHistory,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateETA = (shipment) => {
    const { lat: lat1, lng: lng1 } = shipment.currentLocation;
    const { lat: lat2, lng: lng2 } = shipment.destination;

    const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
    return Math.max(Math.floor(distance * 120), 1); // ETA in mins
  };

  const filteredShipments =
    filterStatus === "All"
      ? shipments
      : shipments.filter((s) => s.status === filterStatus);

  const getPolylineColor = (status) => {
    switch (status) {
      case STATUS.PENDING:
        return "gray";
      case STATUS.SHIPPED:
        return "blue";
      case STATUS.DELIVERED:
        return "green";
      default:
        return "black";
    }
  };

  return (
    <div className="tracking-container">
      <div className="tracking-layout">
        <div className="panel-section">
          <div className="dashboard-section">
            <h3>Live Dashboard</h3>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <p>Total</p>
                <h4>{shipments.length}</h4>
              </div>
              <div className="dashboard-card">
                <p>Pending</p>
                <h4>{shipments.filter((s) => s.status === STATUS.PENDING).length}</h4>
              </div>
              <div className="dashboard-card">
                <p>Shipped</p>
                <h4>{shipments.filter((s) => s.status === STATUS.SHIPPED).length}</h4>
              </div>
              <div className="dashboard-card">
                <p>Delivered</p>
                <h4>{shipments.filter((s) => s.status === STATUS.DELIVERED).length}</h4>
              </div>
            </div>

            <select
              onChange={(e) => setFilterStatus(e.target.value)}
              value={filterStatus}
              className="status-filter"
            >
              <option value="All">All</option>
              <option value={STATUS.PENDING}>Pending</option>
              <option value={STATUS.SHIPPED}>Shipped</option>
              <option value={STATUS.DELIVERED}>Delivered</option>
            </select>
          </div>

          <h3>Shipments</h3>
          {filteredShipments.map((s) => (
            <div className="shipment-card" key={s.id}>
              <h4>{s.product}</h4>
              <p>Status: <span className={`status-badge ${s.status.toLowerCase()}`}>{s.status}</span></p>
              <p>ETA: {s.eta} mins</p>
            </div>
          ))}
        </div>

        <div className="map-section">
          <MapContainer center={[22.9734, 78.6569]} zoom={5} className="map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            {filteredShipments.map((s) => (
              <React.Fragment key={s.id}>
                {/* Route line */}
                <Polyline positions={[s.origin, s.destination]} color="lightgray" />

                {/* Breadcrumb trail */}
                {s.history && (
                  <Polyline positions={s.history.map((loc) => [loc.lat, loc.lng])} color={getPolylineColor(s.status)} />
                )}

                {/* Current marker */}
                <Marker
                  position={[s.currentLocation.lat, s.currentLocation.lng]}
                  icon={L.icon({
                    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                    iconSize: [25, 25],
                  })}
                >
                  <Popup>
                    <strong>{s.product}</strong>
                    <br />
                    Status: {s.status}
                    <br />
                    ETA: {s.eta} mins
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
