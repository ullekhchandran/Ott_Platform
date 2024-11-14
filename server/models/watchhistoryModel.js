const mongoose = require('mongoose')
const watchhistorySchema = new mongoose.Schema({

    userId: {
        type: String,

    },
    movieId: {
        type: String,
    },
    dateTime:{
        type:Date,
        default:Date.now

    }



})

const watchhistoryModel = mongoose.model('Movie', watchhistorySchema)
module.exports = watchhistoryModel;