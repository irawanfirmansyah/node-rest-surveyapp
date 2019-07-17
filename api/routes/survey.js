const express = require('express');
const router = express.Router();
const SurveyController = require('../controllers/survey');

/**
 * Survey routes : 
 * - Get all survey
 * - Get a survey by ID
 * - Create new survey
 * - Update a survey by ID
 * - Delete a survey by ID
 */

router.get("/", SurveyController.survey_get_all);
router.get('/:surveyId', SurveyController.survey_get_by_id);
router.post('/', SurveyController.survey_create_one);
router.patch('/:surveyId', SurveyController.survey_update_one);
router.delete('/:surveyId', SurveyController.survey_delete_by_id);

module.exports = router;