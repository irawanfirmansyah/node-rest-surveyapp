const mongoose = require('mongoose');

/**
 * Survey Model
 */

const surveySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    rating: { type: Number, required: true },
    isSolved: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Survey', surveySchema);