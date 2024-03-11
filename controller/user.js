const Restaurant = require('../models/restaurantModel');

//Retrieve a list of all restaurants available online at the given hour.
exports.getOnlineRestaurantsAtHour = async (req, res) => {
    try {
      const { hour } = req.body;
  
      const onlineRestaurants = await Restaurant.aggregate([
        {
          $match: {
            status: 'online',
            availability: true,
          },
        },
        {
          $unwind: '$workingHours',
        },
        {
          $match: {
            'workingHours.start': { $lte: parseInt(hour) },
            'workingHours.end': { $gte: parseInt(hour) },
          },
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            menu: { $first: '$menu' },
            availability: { $first: '$availability' },
            status: { $first: '$status' },
            workingHours: { $push: '$workingHours' },
          },
        },
      ]);
  
      return res.json(onlineRestaurants);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  