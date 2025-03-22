const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
   count:{
    
    type:Number,
    default:0

   },

    title: {
        type: String,
        required:true,

    },
    description: {
        type: String,

    },

    thumbnail: {
        type: String,
        required: true, // Ensure that a thumbnail URL is provided
        // validate: {
        //   validator: function (v) {
        //     // Validate that the value is a proper URL
        //     return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(v);
        //   },
        //   message: 'Please enter a valid URL for the thumbnail',
        // },
      },
    video: {

        type: String,
        required: true

    },
   
    
    createdAt:{
      type:Date,
      default:Date.now
  }


})

const movieModel = mongoose.model('Movie', movieSchema)
module.exports = movieModel;