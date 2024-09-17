const express = require('express');

const routers = express.Router();

routers.use('/api/auths', require('../routes/authsRoute'));
routers.use('/api/finance-boxs', require('../routes/financeBoxRoute'));

module.exports = routers;