const mongoose = require('mongoose');
const Survey = require('../models/survey');
const surveyHelper = require('../helpers/survey.helper');
const userHelper = require('../helpers/user.helper');
const asyncMiddleware = require('../middleware/async-middleware');

/**
 * Survey controllers
 * 
 */

exports.survey_get_all = asyncMiddleware(async (req, res, next) => {
	const allSurvey = await surveyHelper.getAllSurvey();
	res.status(200).json({
		count: allSurvey.length,
		data: allSurvey
	});
});

exports.survey_get_by_id = asyncMiddleware(async (req, res, next) => {
	const id = req.params.surveyId;
	const surveyFound = await surveyHelper.getSurveyById(id);
	if (!surveyFound) {
		const error = new Error(`No survey entry with such ID`);
		error.status = 404;
		throw error;
	} else {
		res.status(200).json(surveyFound);
	}

});

exports.survey_create_one = asyncMiddleware(async (req, res, next) => {
	const userFound = await userHelper.getUserById(req.body.userId);
	if (!userFound) {
		throw new Error('Internal Server Error!');
	}
	const newSurvey = new Survey({
		_id: new mongoose.Types.ObjectId(),
		rating: req.body.rating,
		isSolved: false,
		user: req.body.userId
	});
	const result = await surveyHelper.create(newSurvey);
	res.status(201).json({
		message: `Survey with ${result._id} ID has been created`,
		createdSurvey: {
			_id: result.id,
			rating: result.rating,
			isSolved: result.isSolved,
			user: result.user
		}
	});
});

exports.survey_update_one = asyncMiddleware(async (req, res, next) => {
	const id = req.params.surveyId;
	let surveyIsExist = await surveyHelper.getSurveyById(id);
	console.log(surveyIsExist);
	if (!surveyIsExist) {
		const error = new Error(`No survey entry with such ID`)
		error.status = 404;
		throw error;
	}
	const updatedProps = {};
	for (const prop of req.body) {
		updatedProps[prop.propName] = prop.value;
	}
	await surveyHelper.update(id, updatedProps);
	res.status(200).json({
		message: `Survey with ${id} ID has been updated`
	});

});

exports.survey_delete_by_id = asyncMiddleware(async (req, res, next) => {
	const id = req.params.surveyId;
	let surveyIsExist = await Survey.findById(id);
	if (!surveyIsExist) {
		const error = new Error(`No survey entry with such ID`)
		error.status = 404;
		throw error;
	}
	await surveyHelper.delete(id);
	return res.status(200).json({ message: `Survey with ${id} ID has been deleted` });
});