const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("🔄 Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  });
};
connectWithRetry();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/inventory", require("./routes/inventory"));  
app.use("/api/orders", require("./routes/orders"));         
app.use("/api/dashboard", require("./routes/dashboard"));   
app.use("/api/tracking", require("./routes/tracking"));     

// Root route
app.get("/", (req, res) => {
  res.send("🚚 Supply Chain API is running...");
});

// Start the server
const PORT = process.env.PORT; // Use Render's assigned port (e.g., 10000)
if (!PORT) {
  console.error("❌ PORT environment variable is not set");
  process.exit(1);
}
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});