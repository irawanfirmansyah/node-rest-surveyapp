const express = require('express')
const router = express.Router();
const UserController = require('../controllers/user');

/**
 * User routes : 
 * - Create new user
 * - User login
 * - Delete user
 */

router.post('/signup', UserController.user_create);
router.post('/login', UserController.user_login);
router.delete('/:userId', UserController.user_delete);

module.exports = router;