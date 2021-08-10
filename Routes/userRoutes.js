const express = require('express'); 
const router = express.Router();

//require models
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Bid = require('../models/bidModel');
const Review = require('../models/reviewModel');


router.get('/me/profile', async(req,res)=>{
    const currentUser = await User.findById(req.session.user_id).populate('products');
    res.render('userViews/profile',{currentUser});

})


router.get('/dashboard/alpha', async(req,res)=>{

    const products = await Product.find({}).collation({locale:'en',strength: 2}).sort({name : 1}).populate('owner').populate({
        path : 'highestBid',
        populate : {
            path : 'owner'
        }
    });
    const alpha=1;
    const currentUser = await User.findById(req.session.user_id);
    res.render('productViews/dashboard',{products,currentUser,alpha});

})

router.post('/sort' , async(req,res)=>{
    if(req.body.sort=='highestbid'){
        res.redirect('/dashboard');
    }
    if(req.body.sort == 'alpha'){
        res.redirect('/dashboard/alpha');
    }
})

router.post('/search', async(req,res)=>{
    const searchOption = req.body.searchoption;
    if(searchOption == 'Search by tag'){
        const tag = req.body.tag;
        const products = await Product.find({tag}).populate({
            path : 'bids',
            populate : {
                path : 'owner'
            }
        }).populate('owner').populate({
            path : 'highestBid',
            populate : {
                path : 'owner'
            }
        }).populate({
            path : 'reviews',
            populate : {
                path : 'user'
            }
        });
        res.render('productViews/tagsearch',{products,tag})
    }
    if(searchOption == 'Search by name'){
        const name = req.body.product;
        if(name!=''){
        const products = await Product.find({ name: new RegExp(name, 'i') }).populate({
            path : 'bids',
            populate : {
                path : 'owner'
            }
        }).populate('owner').populate({
            path : 'highestBid',
            populate : {
                path : 'owner'
            }
        }).populate({
            path : 'reviews',
            populate : {
                path : 'user'
            }
        });
        res.render('productViews/namesearch',{products,name});
        } else {
            req.flash('error_msg','Please enter something to search!')
            res.redirect('/dashboard');
        }
        
    }
})



module.exports = router;