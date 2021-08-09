const express = require('express'); 
const router = express.Router();

//require models
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Bid = require('../models/bidModel');


router.get('/me/profile', async(req,res)=>{
    const currentUser = await User.findById(req.session.user_id).populate('products');
    res.render('userViews/profile',{currentUser});

})




module.exports = router;