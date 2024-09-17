const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// add middleware
app.use(express.json());
app.use(cookieParser());

app.use(require('./src/middlewares/useAuthentication'));

// map to controllers
app.use(require('./src/middlewares/useMapController'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server listening at http://localhost:" + PORT);
});