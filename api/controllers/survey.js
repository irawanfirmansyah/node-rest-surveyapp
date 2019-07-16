const mongoose = require('mongoose');
const Survey = require('../models/survey');
const User = require('../models/user');

/**
 * Get All survey
 */
exports.survey_get_all = (req, res, next) => {
    Survey.find()
        .select('_id rating isSolved')
        .then(docs => {
            return res.status(200).json({
                count: docs.length, data: docs
            });
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        });
}

/**
 * Get survey by ID
 */
exports.survey_get_by_id = (req, res, next) => {
    const id = req.params.surveyId;
    Survey.findById(id)
        .select('_id rating isSolved')
        .then(doc => {
            if (doc) {
                return res.status(200).json(doc);
            } else {
                return res.status(404).json({ message: "There is no survey found with such ID" })
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        });
}

/**
 * Create Survey
 */
exports.survey_create_one = (req, res, next) => {
    User.findById(req.body.userId)
        .then(() => {
            const newSurvey = new Survey({
                _id: new mongoose.Types.ObjectId(),
                rating: req.body.rating,
                isSolved: false,
                user: req.body.userId
            });
            newSurvey.save()
                .then(result => {
                    return res.status(201).json({
                        message: `Survey with ${result._id} ID has been created`,
                        createdSurvey: {
                            _id: result.id,
                            rating: result.rating,
                            isSolved: result.isSolved,
                            user: result.user
                        }
                    });
                })
                .catch(() => {
                    return res.status(500).json({
                        error: `Internal server error`
                    });
                });
        })
        .catch(() => {
            return res.status(401).json({
                message: err
            });
        });
}

/**
 * Update survey by ID
 */
exports.survey_update_one = (req, res, next) => {
    const id = req.params.surveyId;
    const updatedProps = {};
    for (const prop of req.body) {
        updatedProps[prop.propName] = prop.value;
    }
    Survey.findById(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: `No survey entry with such id` });
            } else {
                Survey.updateOne({ _id: id }, updatedProps)
                    .then(() => {
                        return res.status(200).json({ message: `Survey with ${id} ID has been udpated` });
                    })
                    .catch(err => {
                        return res.status(500).json({ error: err });
                    });
            }
        });
}

/**
 * Delete survey by ID
 */
exports.survey_delete_by_id = (req, res, next) => {
    const id = req.params.surveyId;
    Survey.findById(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: `No survey entry with such ID` });
            } else {
                Survey.deleteOne({ _id: id })
                    .then(() => {
                        return res.status(200).json({ message: `Survey with ${id} ID has been deleted` });
                    });
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        });
}