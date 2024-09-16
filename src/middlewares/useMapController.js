const express = require('express');

const routers = express.Router();

routers.use('/api/auths', require('../routes/authsRoute'));

module.exports = routers;