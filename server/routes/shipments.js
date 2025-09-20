const express = require("express");
const router = express.Router();
const shipments = require("../data/shipments.json");

router.get("/", (req, res) => {
  res.json(shipments);
});

module.exports = router;
