const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BidSchema = new Schema({
    price : {
        type : Number
    },
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product : {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
},{
    timestamps: true
});


module.exports = mongoose.model('Bid', BidSchema );