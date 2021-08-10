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
    },
    tag : {
        type : String
    },
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    highBidPrice : { // this is just for setting max value in forms
        type : Number
    },
    highestBid : {
        type: Schema.Types.ObjectId,
        ref: 'Bid'
    },
    bids : [{
        type: Schema.Types.ObjectId,
        ref: 'Bid'
    }],
    canBid : {
        type : Boolean,
        default : true
    },
    bidDeadline : {
        type : Date
    },
    reviews : [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
},{
    timestamps: true
});


module.exports = mongoose.model('Product', ProductSchema );