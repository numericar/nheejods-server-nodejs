const express = require('express');

const financeBoxController = require('../controllers/financeBoxController');
const useAuthorize = require('../middlewares/useAuthorize');

const routers = express.Router();

routers.get('', [useAuthorize], financeBoxController.getFinanceBoxs);
routers.get('/:financeBoxId', [useAuthorize], financeBoxController.getFinanceBoxById);
routers.post('', [useAuthorize], financeBoxController.createFinanceBox);
routers.patch('/:financeBoxId/items', [useAuthorize], financeBoxController.updateFinanceItems);
routers.get('/health-check', [], financeBoxController.healthCheck);

module.exports = routers;