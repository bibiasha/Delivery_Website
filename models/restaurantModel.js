const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const workingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  menu: [menuItemSchema],
  availability: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online',
  },
  workingHours: [workingHoursSchema], 
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
