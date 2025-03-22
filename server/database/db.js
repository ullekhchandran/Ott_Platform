const mongoose= require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_ATLAS_CONNECTION_URL )

const db= mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));
db.once('open',()=>{
    console.log('connected to MongoDB')
})

module.export=db;