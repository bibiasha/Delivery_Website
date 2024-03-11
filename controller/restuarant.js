const Restaurant = require('../models/restaurantModel');

exports.createRestaurant = async (req, res) => {
  try {
    const { name, menu, availability, workingHours } = req.body;

    const newRestaurant = new Restaurant({
      name,
      menu: menu.map(item => ({ name: item.name, price: item.price })),
      availability,
      workingHours,
    });

    const createdRestaurant = await newRestaurant.save();
    return res.json(createdRestaurant);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



//Update the menu, pricing, and availability status (online/offline) of the restaurant.
exports.updateRestaurant = async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
  
      let existingRestaurant = await Restaurant.findOne({ _id: restaurantId });
  
      if (!existingRestaurant) {
        existingRestaurant = new Restaurant({ _id: restaurantId });
      }
      existingRestaurant.menu = req.body.menu;
      existingRestaurant.pricing = req.body.pricing;
      existingRestaurant.availability = req.body.availability;
  
      const updatedRestaurant = await existingRestaurant.save();
  
      return res.json(updatedRestaurant);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };


