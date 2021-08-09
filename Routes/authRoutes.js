const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/userModel');
const Product = require('../models/productModel');

router.get('/register', (req,res)=>{
    res.render('authViews/register')
})

router.post('/register',async(req,res)=>{
    const {password,username,email,age} = req.body;
    const user = await User.findOne({username});
    if(!user){
        const hash = await  bcrypt.hash(password,8);
        const newUser = new User({username,password:hash,email,age}); 
        await newUser.save();    
        req.flash("success_msg", "Successfully registered, You can login now!");
        res.redirect('/login');
    } else{
        req.flash("error_msg", "Username already taken! Try again!");
        res.redirect('/register');
    }
    
})

router.get('/login', (req,res)=>{
    res.render('authViews/login');
})

router.post('/login', async(req,res)=>{
    const {username , password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        req.flash("error_msg", "Incorrect username or password");
        res.redirect('/login');
    }
    else{
        const validPassword = await bcrypt.compare(password , user.password);
        if(validPassword){
            req.session.user_id = user._id;
            req.flash("success_msg", "Welcome to Ancient Auctions");
            res.redirect('/dashboard');
        }else {
            req.flash("error_msg", "Invalid username or password");
            res.redirect('/login');
        }
    }
})

router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login');
})




module.exports = router;