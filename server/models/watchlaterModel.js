const mongoose = require('mongoose')
const watchlaterSchema = new mongoose.Schema({

    userId: {
        type: String,

    },
    movieId: {
        type: String,
    }



})

const watchlaterModel = mongoose.model('Movie', watchlaterSchema)
module.exports = watchlaterModel;