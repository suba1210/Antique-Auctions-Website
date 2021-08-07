const express = require('express'); 
const router = express.Router();
const Product = require('../models/productModel')
const User = require('../models/userModel')
const path = require('path');
const fs = require('fs');

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


router.get('/newproduct',(req,res)=>{
    res.render('productViews/newproduct');
})

router.post('/newproduct', (req,res)=>{
    upload(req,res,(err) => {
        if(err){
            res.send('error');
            console.log(err);
        } else {
            console.log(req.file);
            const name = req.body.name;
            const description = req.body.description;
            const startPrice = req.body.startPrice;
            const product = new Product({name,description,startPrice,
            image: { 
                data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)), 
                contentType: 'image/png'
            } } )           
            product.save();
            res.render('productViews/showproduct', { product });
        }
    });
});

router.get('/dashboard', async(req,res)=>{
    const products = await Product.find();
    res.render('productViews/dashboard',{products});
})

router.get('/product/:id/show',async(req,res)=>{
    const product = await Product.findById(req.params.id);
    res.render('productViews/showproduct',{product});
})

router.get('/product/:id/update', async(req,res)=>{
    const product = await Product.findById(req.params.id);
    res.render('productViews/updateproduct',{product});
})

router.put('/product/:id/update',async(req,res)=>{
    const name = req.body.name;
    const description = req.body.description;
    const startPrice = req.body.startPrice; 
    const product = await Product.findByIdAndUpdate(req.params.id, {name,description,startPrice});
    res.redirect(`/product/${req.params.id}/show`)
})

router.delete('/product/:id/delete',async(req,res)=>{
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
})






module.exports = router;