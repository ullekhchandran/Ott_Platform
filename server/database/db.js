const mongoose= require('mongoose');
require('dotenv').config()

mongoose.connect('mongodb+srv://ullekhchandran:Threedots%4099@cluster0.lddmr.mongodb.net/')

const db= mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));
db.once('open',()=>{
    console.log('connected to MongoDB')
})

module.export=db;