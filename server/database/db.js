const mongoose= require('mongoose');
require('dotenv').config()

mongoose.connect('mongodb://localhost:27017/ott_database')

const db= mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));
db.once('open',()=>{
    console.log('connected to MongoDB')
})

module.export=db;