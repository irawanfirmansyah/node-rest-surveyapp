const express = require('express')
const router = express.Router();
const userController = require('../controllers/user');
const checkAuthentication = require('../middleware/user-authentication');

/**
 * User routes : 
 * - Create new user
 * - User login
 * - Delete user
 */

router.post('/signup', userController.user_create);
router.post('/login', userController.user_login);
router.delete('/:userId', checkAuthentication, userController.user_delete);

module.exports = router;