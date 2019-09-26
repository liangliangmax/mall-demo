let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    "productId":String,
    "productName":String,
    "salePrice":Number,
    "checked": String,
    "productImg":String
});

module.exports = mongoose.model('Good',productSchema,'goods');