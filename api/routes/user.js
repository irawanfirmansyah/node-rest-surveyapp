const express = require('express')
const router = express.Router();
const mongoose = reuire('mongoose');

router.post('/login', (request, response, next) => {
    response.status(200).json({
        message : 'Login success!!'
    });
});

router.post('/signup', (request, response, next) => {
    response.status(201).json({
        message: 'Your account have been created!!'
    });
});

router.delete('/:userId', (request, response, next) => {
    response.status(201).json({
        message: 'Delete account success',
        id: request.params.userId
    });
});

module.exports = router;