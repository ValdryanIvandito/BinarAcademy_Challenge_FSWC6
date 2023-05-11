const express = require('express');
const app = express();
const port = 3001;

// Using ejs
app.set('view engine', 'ejs');

// application level middleware
const logger = (req, res, next) => {
    console.log('API: ', req.method, req.url);
    next();
};
app.use(logger);

// Build in middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// routing level middleware
const router = require('./router/routing.js');
app.use(router);

// error handling middleware
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});