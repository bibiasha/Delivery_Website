const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  orders: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
