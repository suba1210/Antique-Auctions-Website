const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const productRoutes = require('./Routes/productRoutes');
const userRoutes = require('./Routes/userRoutes');
const authRoutes = require('./Routes/authRoutes');
const bidRoutes = require('./Routes/bidRoutes');





mongoose.connect('mongodb://localhost:27017/spidertask3', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();


app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret : 'thisisasecret',
    resave : false,
    saveUninitialized:false,
    cookie : {
        httpOnly:true,
        expires : Date.now() + (1000*60*60*24*7),
        maxAge : 1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})

app.use(bidRoutes);
app.use(productRoutes);
app.use(userRoutes);
app.use(authRoutes);



app.listen(3000, ()=>{
    console.log("Serving at port 3000")
})