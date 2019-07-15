const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Survey = require('../models/survey');

//Handle GET request to get All survey
router.get("/", (req, res, next) => {
    Survey.find()
        .select('_id rating isSolved')
        .then(docs => {
            res.status(200).json({
                count: docs.length, data: docs
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

//Handle GET request to get survey by ID
router.get('/:surveyId', (req, res, next) => {
    const id = req.params.surveyId;
    Survey.findById(id)
        .select('_id rating isSolved')
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "There is no survey found with such ID" })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err })
        });
});

//Handle POST request to add survey
router.post('/', (req, res, next) => {

    const newSurvey = new Survey({
        _id: new mongoose.Types.ObjectId(),
        rating: req.body.rating,
        isSolved: false
    });
    newSurvey.save()
        .then(result => {
            res.status(201).json({
                message: `Survey with ${result._id} ID has been created`,
                createdSurvey: {
                    _id: result.id,
                    rating: result.rating,
                    isSolved: result.isSolved
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//Handle PATCH request to update survey's state
router.patch('/:surveyId', (req, res, next) => {
    const id = req.params.surveyId;
    const updatedProps = {};
    for (const prop of req.body) {
        updatedProps[prop.propName] = prop.value;
    }
    Survey.findById(id)
        .then(result => {
            if (!result) {
                res.status(404).json({ error: `No survey entry with such id` });
            } else {
                Survey.updateOne({ _id: id }, updatedProps)
                    .then(() => {
                        res.status(200).json({ message: `Survey with ${id} ID has been udpated` });
                    })
                    .catch(err => {
                        res.status(500).json({ error: err });
                    });
            }
        });
});

//Handle DELETE request to delete survey by ID
router.delete('/:surveyId', (req, res, next) => {
    const id = req.params.surveyId;
    Survey.findById(id)
        .then(result => {
            if (!result) {
                res.status(404).json({ error: `No survey entry with such ID` });
            } else {
                Survey.deleteOne({ _id: id })
                    .then(() => {
                        res.status(200).json({ message: `Survey with ${id} ID has been deleted` });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;