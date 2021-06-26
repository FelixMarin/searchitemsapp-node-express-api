const mongoose = require('mongoose');

const CompanySchema = mongoose.Schema({
    name: String,
    description: String,
    category: String,
    country: String,
    image: String,
    product: String,
    unit_price: String,
    reference_price: String,
    image_alt: String,
    url: String,
    link: String,
    content: String,
    offer_price: String

}, {
    timestamps: true
});

module.exports = mongoose.model('Companies', CompanySchema);