const mongoose= require('mongoose');
require('dotenv').config()
console.log(process.env.MONGODB_ATLAS_CONNECTION_URL)
mongoose.connect(process.env.MONGODB_ATLAS_CONNECTION_URL)

console.log("🔹 Connected to databaseeee:", mongoose.connection.name)
const db= mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));
db.once('open',()=>{
    console.log('connected to MongoDB')
})

module.exports=db;