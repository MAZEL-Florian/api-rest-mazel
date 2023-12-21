const { Router } = require('express');
const requireAuth = require('../middlewares/require-auth');
const requireRoles = require('../middlewares/require-role');
const Dish = require('../models/Dish');

module.exports = function (app, router) {
  router.post('/dishes', [requireAuth, requireRoles(['ADMIN', 'USER' , 'RESTAURANT'])], async (req, res) => {
    try {
      const dish = new Dish(req.body);
      await dish.save();
      res.status(201).send(dish);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  // avoir tout les dishs d'un restaurant (ADMIN, RESTAURANT)
  router.get('/dishes/restaurant/:id', [requireAuth, requireRoles(['ADMIN', 'RESTAURANT'])], async (req, res) => {
    try {
      const dishes = await Dish.find({ restaurant: req.params.id });
      res.send(dishes);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  // put dish by id (ADMIN, RESTAURANT)
  router.put('/dishes/:id', [requireAuth, requireRoles(['ADMIN', 'RESTAURANT'])], async (req, res) => {
    try{
      const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!dish) {
        return res.status(404).send();
      }
      res.send(dish);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  // Récupérer tous les dishs (Utilisateur, Restaurant)
  router.get('/dishes', [requireAuth, requireRoles(['ADMIN', 'USER' , 'RESTAURANT'])], async (req, res) => {
    res.send(await Dish.find());
  });

  //get by id
  router.get('/dishes/:id', [requireAuth, requireRoles(['ADMIN', 'USER' , 'RESTAURANT'])], async (req, res) => {
    res.send(await Dish.findById(req.params.id));
  });

  //delete all
  router.delete('/dishes', [requireAuth, requireRoles(['ADMIN'])], async (req, res) => {
    res.send(await Dish.deleteMany());
  });
};
