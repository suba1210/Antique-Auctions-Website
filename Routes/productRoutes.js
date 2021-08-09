const express = require('express'); 
const router = express.Router();
const Product = require('../models/productModel')
const User = require('../models/userModel')
const Bid = require('../models/bidModel');
const path = require('path');
const fs = require('fs');
const {checkAuth} =require('../middlewares/checkauth');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename : function(req, file, cb){
        cb(null,file.fieldname + '-' +Date.now()+path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits:{filesize : 1000000},
    fileFilter : function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('image');

function checkFileType(file,cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }else {
        cb('Error : Images only');
    }
}

const saveProduct = async(product,user_id)=>{
    const currentUser = await User.findById(user_id);
    currentUser.products = await currentUser.products.concat(product._id);
    await currentUser.save();
}

router.get('/newproduct',checkAuth,(req,res)=>{
    res.render('productViews/newproduct');
})

router.post('/newproduct',checkAuth, async(req,res)=>{
    upload(req,res,(err) => {
        if(err){
            res.send('error');
            console.log(err);
        }  else {
                const name = req.body.name;
                const description = req.body.description;
                const startPrice = req.body.startPrice;
                const tag = req.body.tag;
                const owner = req.session.user_id;
                const highBidPrice = startPrice;
                const bidDeadline =req.body.deadline;
                const product = new Product({name,description,startPrice,tag,owner,highBidPrice,bidDeadline,
                image: { 
                    data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)), 
                    contentType: 'image/png'
                }})           
                product.save();
                saveProduct(product,req.session.user_id);
                req.flash("success_msg", "Successfully saved your product!");
                res.redirect(`/product/${product._id}/show`);
        }
    });
});

router.get('/dashboard',checkAuth, async(req,res)=>{

    const products = await Product.find({}).sort('-highBidPrice').populate('owner').populate({
        path : 'highestBid',
        populate : {
            path : 'owner'
        }
    });
    const currentUser = await User.findById(req.session.user_id);
    res.render('productViews/dashboard',{products,currentUser});
    
})

router.get('/product/:id/show',checkAuth,async(req,res)=>{
    const product = await Product.findById(req.params.id).populate({
        path : 'bids',
        populate : {
            path : 'owner'
        }
    }).populate('owner').populate({
        path : 'highestBid',
        populate : {
            path : 'owner'
        }
    });
    
    const currentUser = await User.findById(req.session.user_id);

    let now = Date.now();
    let deadline = new Date(product.bidDeadline);
    if(now >= deadline)
    {
       product.canBid = false;
    }

    if(product.owner.username == currentUser.username){
        res.render('productViews/ownerproductshow',{product,currentUser});
    } else {
        res.render('productViews/userproductshow',{product,currentUser});
    }  
})

router.get('/product/:id/update',checkAuth, async(req,res)=>{
    const product = await Product.findById(req.params.id);
    res.render('productViews/updateproduct',{product});
})

router.put('/product/:id/update',checkAuth,async(req,res)=>{
    const name = req.body.name;
    const description = req.body.description;
    const startPrice = req.body.startPrice; 
    const product = await Product.findByIdAndUpdate(req.params.id, {name,description,startPrice});
    req.flash("success_msg", "Successfully updated your product!");
    res.redirect(`/product/${req.params.id}/show`)
})

router.delete('/product/:id/delete',checkAuth,async(req,res)=>{
    const product = await Product.findById(req.params.id).populate('owner');
    const owner = await User.findById(product.owner._id);
    const index = await owner.products.indexOf(product._id);
    await owner.products.splice(index, 1);
    await owner.save();
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
})

router.get('/product/:id/endbid', checkAuth, async(req,res)=>{
    const product = await Product.findById(req.params.id);
    product.canBid = false ; 
    await product.save();
    res.redirect(`/product/${product._id}/show`);
})






module.exports = router;