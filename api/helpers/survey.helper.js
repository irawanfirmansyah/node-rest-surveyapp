const Survey = require('../models/survey');

/**
 * Survey Model API helpers
 */

exports.getAllSurvey = () => Survey.find();
exports.getSurveyById = (surveyId) => Survey.findById(surveyId);
exports.create = (SurveyObject) => SurveyObject.save();
exports.update = (surveyId, properties) => Survey.updateOne({ _id: surveyId }, properties);
exports.delete = (surveyId) => Survey.deleteOne({ _id: surveyId });