module.exports = (app) => {
    const brw = require('../controllers/browse.controller.js');

    // Find a company by name
    app.get('/search/:product/:companyname', brw.scrapperGet);

    app.get('/searchbrowser/:product/:companyname', brw.scrapeBrowser);

    app.get('/:companyname/:product', brw.scrapperPostMercadona);
};