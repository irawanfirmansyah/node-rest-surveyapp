const express = require('express');
const router = express.Router();

router.post('/login', (req, res, next) => {
    res.status(200).json({
        msg : 'Login success!!'
    });
});

router.post('/signup', (req, res, next) => {
    res.status(201).json({
        msg: 'Your account have been created!!'
    });
});

router.delete('/:userId', (req, res, next) => {
    res.status(201).json({
        msg: 'Delete account success',
        id: req.params.userId
    });
});

module.exports = router;