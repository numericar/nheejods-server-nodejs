const express = require('express');

const app = express();

// add middleware
app.use(express.json());

app.use(require('./src/middlewares/useMapController'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server listening at http://localhost:" + PORT);
});