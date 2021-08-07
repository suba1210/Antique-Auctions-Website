const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
    username : {
        type : String,
        unique : true
    },
    password : {
        type : String,
    }
});



UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema );