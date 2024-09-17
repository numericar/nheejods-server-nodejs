const express = require('express');

const financeItemController = require('../controllers/financeItemController');

const routers = express.Router();

routers.get('/health-check', financeItemController.healthCheck);

module.exports = routers;