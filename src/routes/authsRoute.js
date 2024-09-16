const express = require('express');

// get controller
const authsController = require('../controllers/authsController');

// initialize router
const routers = express.Router();

// add route to controller function
routers.post('/register', authsController.register);
routers.get('/health-check', authsController.healthCheck);

module.exports = routers;