const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name : {
        type:String
    },
    description : {
        type : String
    },
    startPrice : {
        type : Number
    },
    image : {
        data : Buffer,
        contentType : String
    }
});


module.exports = mongoose.model('Product', ProductSchema );