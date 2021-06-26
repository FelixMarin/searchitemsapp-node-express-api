module.exports = (app) => {
    const sc = require('../controllers/search.controller.js');

    // Find a company by name
    app.get('/search/:product/:companyname', sc.search);

    app.get('/mercadona/:product', sc.mercadona);
};