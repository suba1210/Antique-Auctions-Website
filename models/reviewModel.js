const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
   
    rating : {
        type : Number
    },
    comment : {
        type : String
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
},{
    timestamps: true
});


module.exports = mongoose.model('Review', ReviewSchema );