const mongoose = require('mongoose');
const userModel = require('./user');

const surveySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    rating: Number,
    isSolved: Boolean
    // user: {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
})

module.exports = mongoose.model('Survey', surveySchema);