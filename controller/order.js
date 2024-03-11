const Order = require('../models/orderModel');
const Restaurant = require('../models/restaurantModel');
const DeliveryAgent = require('../models/deliveryagent');


//Auto-assign a delivery agent to an order based on availability.
//place the order from the available restaurants.
exports.placeOrder = async (req, res) => {
  try {
    const { restaurantId, selectedMenuItems } = req.body;

    const selectedRestaurant = await Restaurant.findOne({ _id: restaurantId, availability: true, status: 'online' });

    if (!selectedRestaurant) {
      return res.status(400).json({ error: 'The selected restaurant is not available online' });
    }

    const availableDeliveryAgent = await DeliveryAgent.findOne({ availability: true });

    if (!availableDeliveryAgent) {
      return res.status(400).json({ error: 'No available delivery agent found' });
    }

    const newOrder = new Order({
      restaurantId,
      deliveryAgentId: availableDeliveryAgent._id,
      menuItems: selectedMenuItems,
      status: 'pending', 
    });

    const createdOrder = await newOrder.populate('Restaurant').execPopulate();

    availableDeliveryAgent.availability = false;
    await availableDeliveryAgent.save();

    return res.json({ success: true, order: createdOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Update the delivery status of orders.
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const validStatusValues = ['pending', 'shipped', 'delivered'];
    if (!validStatusValues.includes(deliveryStatus)) {
      return res.status(400).json({ error: 'Invalid delivery status value' });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: deliveryStatus } },
      { new: true }
    );

    return res.json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, restaurantId } = req.params;
    const { action } = req.body;

    const order = await Order.findOne({ _id: orderId, restaurantId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found for the specified restaurant' });
    }

    if (action === 'accept') {
      if (order.status === 'shipped' || order.status === 'delivered') {
        return res.status(400).json({ error: 'Order has already been processed' });
      }
      order.status = 'shipped'; 

    } else if (action === 'reject') {
      if (order.status === 'delivered') {
        return res.status(400).json({ error: 'Cannot reject a delivered order' });
      }

      order.status = 'rejected';
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    await order.save();

    return res.json({ message: `Order ${order.status}` });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

  
exports.ratingOrder= async (req, res) => {
  try {
   
    const { rating, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'Order must be delivered to be rated' });
    }

    order.rating = rating;

    await order.save();

    return res.json({ success: true, message: 'Order rated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.ratingDeliveryAgent = async (req, res) => {
  try {
    const{orderId,rating}=req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'Order must be delivered to be rated' });
    }

    const agentId = order.deliveryAgentId;

    const deliveryAgent = await DeliveryAgent.findById(agentId);

    if (!deliveryAgent) {
      return res.status(404).json({ error: 'Delivery agent not found' });
    }

    const existingRating = deliveryAgent.ratings.find((r) => r.orderId.toString() === orderId);

    if (existingRating) {
      return res.status(400).json({ error: 'Order already rated by this delivery agent' });
    }

    deliveryAgent.ratings.push({ orderId, rating });
    const ratings= await deliveryAgent.save();

    return res.json({ success: true, message: 'Delivery agent rated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

