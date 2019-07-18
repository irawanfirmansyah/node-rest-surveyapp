const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/survey');
const checkAuthentication = require('../middleware/user-authentication');

/**
 * Survey routes : 
 * - Get all survey
 * - Get a survey by ID
 * - Create new survey
 * - Update a survey by ID
 * - Delete a survey by ID
 */

router.get("/", surveyController.survey_get_all);
router.get('/:surveyId', surveyController.survey_get_by_id);
router.post('/', checkAuthentication, surveyController.survey_create_one);
router.patch('/:surveyId', checkAuthentication, surveyController.survey_update_one);
router.delete('/:surveyId', checkAuthentication, surveyController.survey_delete_by_id);

module.exports = router;