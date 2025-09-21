// netlify/functions/inventory.js
exports.handler = async (event, context) => {
  const mongoose = require('mongoose');
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  if (event.httpMethod === 'GET') {
    // Example: Fetch inventory (replace with your model)
    const Inventory = mongoose.model('Inventory', new mongoose.Schema({ item: String }));
    const inventory = await Inventory.find();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }, // CORS
      body: JSON.stringify(inventory)
    };
  }
  return { statusCode: 405, body: 'Method not allowed' };
};