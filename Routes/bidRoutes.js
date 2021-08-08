const express = require('express'); 
const router = express.Router();


const User = require('../models/userModel');
const Product = require('../models/productModel');
const Bid = require('../models/bidModel');



router.post('/product/:productid/bid/:userid', async(req,res)=>{
    let product = await Product.findById(req.params.productid).populate('bids')
    let owner = await User.findById(req.params.userid);
    let price = req.body.price;
    let bid = new Bid({price,owner,product});
    if(product.bids.length!=0){
        await bid.save();
        await product.bids.push(bid);
        await product.save();
        let max=0,maxId;
        for(bid of product.bids){
            if(bid.price>max){
                max = bid.price;
                maxId = bid._id;
            }
        }
        product.highBidPrice = max;
        let bid2 = await Bid.findById(maxId);
        product.highestBid = bid2;
        await product.save();

    } else {

        product.highBidPrice = bid.price;
        product.highestBid = bid;
        await product.save();
        await bid.save();
        product.bids.push(bid);
        await product.save();
    }
    res.redirect('back');

})










module.exports = router;