const express = require('express');

// get controller
const authsController = require('../controllers/AuthsController');

// initialize router
const routers = express.Router();

// add route to controller function
routers.get('/health-check', authsController.healthCheck);

module.exports = routers;