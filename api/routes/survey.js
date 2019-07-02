const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Survey = require('../models/survey');

//Handle GET request to get All survey
router.get("/", (req, res, next) => {
    Survey.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

//Handle GET request to get survey by ID
router.get('/:surveyId', (req, res, next) => {
    const id = req.params.surveyId;
    Survey.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "There is no survey found with such ID" })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
});

//Handle POST request to add survey
router.post('/', (req, res, next) => {

    const survey = new Survey({
        _id: new mongoose.Types.ObjectId(),
        rating: req.body.rating,
        isSolved: false
    });
    survey.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "This is a POST survey routes",
                createdSurvey: survey
            });
        })
        .catch(error => {
            console.log(error);
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
    Survey.update({ _id: id }, { $set: updatedProps })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

//Handle DELETE request to delete survey by ID
router.delete('/:surveyId', (req, res, next) => {
    const id = req.params.surveyId;
    Survey.find({ _id: id })
        .countDocuments()
        .then(result => {
            if (result === 0) {
                res.status(404).json({ error: `No survey entry with such ID` });
            } else {
                Survey.deleteOne({ _id: id })
                    .exec()
                    .then(() => {
                        res.status(200).json({ msg: `Survey with ${id} id has been deleted` })
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;