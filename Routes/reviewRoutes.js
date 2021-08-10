const express = require('express'); 
const router = express.Router();


const User = require('../models/userModel');
const Product = require('../models/productModel');
const Bid = require('../models/bidModel');
const Review = require('../models/reviewModel');


router.post('/product/:id/addreview', async(req,res)=>{
    const product = await Product.findById(req.params.id);
    const comment = await new Review({comment : req.body.review , rating :  req.body.rating , user:req.session.user_id });
    await comment.save();
    product.reviews.push(comment._id);
    await product.save();
    res.redirect('back');
})

router.get('/product/:productid/review/:reviewid/delete', async(req,res)=>{
    const product = await Product.findById(req.params.productid);
    await Review.findByIdAndDelete(req.params.reviewid);
    const index = await product.reviews.indexOf(req.params.reviewid);
    await product.reviews.splice(index,1);
    await product.save();
    res.redirect('back');

})

router.get('/product/:productid/review/:reviewid/edit' , async(req,res)=>{
    const currentUser = await User.findById(req.session.user_id);
    const product = await Product.findById(req.params.productid);
    const review = await Review.findById(req.params.reviewid);
    res.render('productViews/updatereview',{product,review,currentUser});

})

router.post('/product/:productid/review/:reviewid/edit', async(req,res)=>{
    const product = await Product.findById(req.params.productid);
    const review = await Review.findById(req.params.reviewid);
    review.rating = req.body.rating;
    review.comment = req.body.review;
    await review.save();
    res.redirect(`/product/${product._id}/show`);

})



module.exports = router;