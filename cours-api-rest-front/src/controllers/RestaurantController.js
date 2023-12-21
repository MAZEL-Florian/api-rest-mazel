const { Router } = require('express');
const requireAuth = require('../middlewares/require-auth');
const requireRoles = require('../middlewares/require-role');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Hash = require("../utils/hash");

/**
 * @param {Express.Application} app
 * @param {Router} router
 */
module.exports = function (app, router) {
 // app.use(express.json());
  router.post('/restaurants', [requireAuth, requireRoles(['ADMIN'])], async (req, res) => {
      try {
        const newRestaurant = new Restaurant({
          name: req.body.name,
          address: req.body.address,
          postalCode: req.body.postalCode,
          city: req.body.city
        });
        await newRestaurant.save();


        const newUser = new User({
          email: req.body.email,
          password: await Hash.hash(req.body.password),
          role: "RESTAURANT",
          restaurant: newRestaurant._id
        });
        await newUser.save();
        res.status(201).send({ restaurant: newRestaurant, user: newUser });
      } 
      catch (error) {
        res.status(500).json({ error: error.message });
      }
  });

  router.get('/restaurants', [requireAuth, requireRoles(['ADMIN', 'USER' , 'RESTAURANT'])], async (req, res) => {
    try {
      const restaurants = await Restaurant.find();
      const users = await User.find({ restaurant: { $in: restaurants } });
      const restaurantsWithUsers = restaurants.map((restaurant) => {
        const user = users.find((user) => user.restaurant.toString() === restaurant._id.toString());
        return { restaurant, user };
      });
      res.send(restaurantsWithUsers);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.put('/restaurants/:id', [requireAuth, requireRoles(['RESTAURANT'])], async (req, res) => {
    try {
      const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!restaurant) {
        return res.status(404).send();
      }
      res.send(restaurant);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  // get restaurant by id (RESTAURANT, ADMIN)
  router.get('/restaurants/:id', [requireAuth, requireRoles(['ADMIN', 'USER' , 'RESTAURANT'])], async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(404).send();
      }
      const user = await User.findOne({ restaurant: restaurant._id });
      res.send({ restaurant, user });
    } catch (error) {
      res.status(400).send(error);
    }
  });

  // delete restaurant by id (ADMIN)
  router.delete('/restaurants/:id', [requireAuth, requireRoles(['ADMIN'])], async (req, res) => {
    res.send(await Restaurant.findByIdAndDelete(req.params.id));
  });

 
  // delete all restaurants (ADMIN)
  router.delete('/restaurants', [requireAuth, requireRoles(['ADMIN'])], async (req, res) => {
    res.send(await Restaurant.deleteMany());
  });
};
