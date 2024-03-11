const DeliveryAgent = require('../models/deliveryagent');

exports.createDeliveryAgent = async (req, res) => {
  try {
    const { name } = req.body;
    const newDeliveryAgent = new DeliveryAgent({
      name,
      availability: true, 
      orders: [], 
    });

    const createdDeliveryAgent = await newDeliveryAgent.save();

    return res.json(createdDeliveryAgent);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
