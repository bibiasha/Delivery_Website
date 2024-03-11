const mongoose = require('mongoose');

const deliveryAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  orders: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      status: String,
    },
  ],
  ratings: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
  ],
});

const DeliveryAgent = mongoose.model('DeliveryAgent', deliveryAgentSchema);

module.exports = DeliveryAgent;
