const express =require("express");
const router = express.Router();
const restaurant=require('../controller/restuarant');
const deliveryAgent=require('../controller/deliveryAgent');
const order=require('../controller/order');
const user=require('../controller/user');

//Restaurant
router.post("/restaurant", restaurant.createRestaurant);
router.put("/updateRestaurant/:restaurantId", restaurant.updateRestaurant);

//Deliver
router.post("/deliveryAgent", deliveryAgent.createDeliveryAgent);

//Order
router.post("/order", order.placeOrder);
router.put("/order/:orderId", order.updateDeliveryStatus);
router.put("/restaurant/:restaurantId/order/:orderId", order.updateOrderStatus);
router.post("/order/orderRating", order.ratingOrder);
router.post("/order/agentRating", order.ratingDeliveryAgent);

//User
router.post("/restaurants/online", user.getOnlineRestaurantsAtHour);
router.post("/agent/rating/:orderId", user.getOnlineRestaurantsAtHour);

router.all("/*", async function (req, res) {
    return res.status(404).send({ status: false, message: "Page Not Found" });
  });


module.exports = router
