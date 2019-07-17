const Survey = require('../models/survey');

exports.getAllSurvey = () => {
    return Survey.find();
}

exports.getSurveyById = (surveyId) => {
    return Survey.findById(surveyId);
}

exports.create = (SurveyObject) => {
    return SurveyObject.save();
}

exports.update = (surveyId, properties) => {
    return Survey.updateOne({ _id: surveyId }, properties);
}

exports.delete = (surveyId) => {
    return Survey.deleteOne({ _id: surveyId });
}