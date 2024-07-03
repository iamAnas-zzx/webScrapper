const mongoose = require('mongoose');

const connectDB = async function (){
    mongoose.connect('mongodb://localhost:27017/Scrapper')
} 
    
module.exports = connectDB;

