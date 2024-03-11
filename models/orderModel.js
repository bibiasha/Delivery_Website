const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  deliveryAgentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryAgent',
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'rejected'],
    default: 'pending',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

