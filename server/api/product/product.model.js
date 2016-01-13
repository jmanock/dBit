'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    title: {type: String, required: true, trim: true},
    price: {type: Number, required: true, min: 0},
    stock: {type: Number, default: 1},
    description: String,
    //imageBin: {data: Buffer, contentType: String}, Don't store a binary of the image in the db
    imageUrl: {
        type: String,
        default: 'http://placehold.it/200x200'
    },
    categories: [{type: Schema.Types.ObjectId, ref: 'Catalog', index: true}]
}).index({ // Add 2 text indexes on title and description. That will allow us to search on those fields.
    'title': 'text',
    'description': 'text'
});

module.exports = mongoose.model('Product', ProductSchema);
