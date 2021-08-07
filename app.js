const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');

const productRoutes = require('./Routes/productRoutes');
const userRoutes = require('./Routes/userRoutes');

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



app.use(productRoutes);
app.use(userRoutes);


app.listen(3000, ()=>{
    console.log("Serving at port 3000")
})