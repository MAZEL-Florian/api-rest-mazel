const { Router } = require('express');
const requireAuth = require('../middlewares/require-auth');
const requireRoles = require('../middlewares/require-role');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const User = require('../models/User');

module.exports = function (app, router) {
  // Passer une order (Utilisateur)
  router.post('/orders', [requireAuth], async (req, res) => {
    try {
      const order = new Order(req.body);
      await order.save();
      res.status(201).send(order);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  // all orders
  router.get('/orders', [requireAuth, requireRoles(['ADMIN', 'USER' , 'RESTAURANT'])], async (req, res) => {
    res.send(await Order.find());
  });

  //get by restaurant id
  router.get('/orders/:id', [requireAuth, requireRoles(['ADMIN', 'USER', 'RESTAURANT'])], async (req, res) => {
    try {
      const dishes = await Dish.find({ restaurant: req.params.id });
      let orders = await Order.find({ dishOrder: { $in: dishes } });

      orders = await Promise.all(orders.map(async (order) => {
        const user = await User.findById(order.user);
        const dish = await Dish.findById(order.dishOrder);
        return {
          ...order.toObject(),
          userInfo: user, 
          dishDetails: dish
        };
      }));
      
      res.send(orders);
    } catch (error) {
      res.status(500).send({ message: "Erreur lors de la récupération des commandes", error: error });
    }
  });
  
  router.delete('/orders/:id', [requireAuth, requireRoles(['ADMIN', 'RESTAURANT', 'USER'])], async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(404).send({ message: "Commande introuvable" });
      }
      res.send(order);
    } catch (error) {
      res.status(500).send({ message: "Erreur lors de la suppression de la commande", error: error });
    }
  }
  );
  
};
