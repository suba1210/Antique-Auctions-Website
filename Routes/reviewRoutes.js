const express = require('express'); 
const router = express.Router();


const User = require('../models/userModel');
const Product = require('../models/productModel');
const Bid = require('../models/bidModel');
const Review = require('../models/reviewModel');
const {checkAuth} =require('../middlewares/checkauth');


router.post('/product/:id/addreview',checkAuth, async(req,res)=>{
    try{
    const product = await Product.findById(req.params.id);
    const comment = await new Review({comment : req.body.review , rating :  req.body.rating , user:req.session.user_id });
    await comment.save();
    product.reviews.push(comment._id);
    await product.save();
    req.flash('success_msg',"Your Comment is added!")
    res.redirect('back');
} catch(err){
    console.log(err);
    req.flash('error_msg','Something went wrong, Try again!');
    res.redirect('/dashboard');
    }
})

router.get('/product/:productid/review/:reviewid/delete',checkAuth, async(req,res)=>{
    try{
    const product = await Product.findById(req.params.productid);
    await Review.findByIdAndDelete(req.params.reviewid);
    const index = await product.reviews.indexOf(req.params.reviewid);
    await product.reviews.splice(index,1);
    await product.save();
    req.flash('success_msg',"Your Comment has been deleted!");
    res.redirect('back');
} catch(err){
    console.log(err);
    req.flash('error_msg','Something went wrong, Try again!');
    res.redirect('/dashboard');
    }

})

router.get('/product/:productid/review/:reviewid/edit' ,checkAuth, async(req,res)=>{
    try{
    const currentUser = await User.findById(req.session.user_id);
    const product = await Product.findById(req.params.productid);
    const review = await Review.findById(req.params.reviewid);
    res.render('productViews/updatereview',{product,review,currentUser});
} catch(err){
    console.log(err);
    req.flash('error_msg','Something went wrong, Try again!');
    res.redirect('/dashboard');
    }

})

router.post('/product/:productid/review/:reviewid/edit',checkAuth, async(req,res)=>{
    try{
    const product = await Product.findById(req.params.productid);
    const review = await Review.findById(req.params.reviewid);
    review.rating = req.body.rating;
    review.comment = req.body.review;
    req.flash('success_msg',"Your Comment has been updated");
    await review.save();
    res.redirect(`/product/${product._id}/show`);
} catch(err){
    console.log(err);
    req.flash('error_msg','Something went wrong, Try again!');
    res.redirect('/dashboard');
    }

})



module.exports = router;