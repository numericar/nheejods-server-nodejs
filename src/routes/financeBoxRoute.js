const express = require('express');

const financeBoxController = require('../controllers/financeBoxController');

const routers = express.Router();

routers.get('/health-check', [], financeBoxController.healthCheck);

module.exports = routers;