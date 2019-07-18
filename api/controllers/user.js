const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const userHelper = require('../helpers/user.helper');
const asyncMiddleware = require('../middleware/async-middleware');

exports.user_create = asyncMiddleware(async (request, response, next) => {
    //Check user if username/email already used
    const usernameIsUsed = await userHelper.getUserByUsernameOrEmail(request.body.username);
    const emailIsUsed = await userHelper.getUserByUsernameOrEmail(request.body.email);
    if (usernameIsUsed || emailIsUsed) {
        const error = new Error('User with such username / name / email already exists');
        error.status = 409;
        throw error;
    }
    //Hashing password
    const hash = await bcrypt.hash(request.body.password, 10);
    if (!hash) {
        throw new Error();
    }
    //Create new user
    const newUser = new User({
        _id: mongoose.Types.ObjectId(),
        fullName: request.body.fullName,
        username: request.body.username,
        email: request.body.email,
        password: hash
    });
    const result = await userHelper.create(newUser);
    response.status(201).json({
        message: `User created`,
        body: {
            _id: result.id,
            fullName: result.fullName,
            username: result.username,
            email: result.email
        }
    });
});

exports.user_login = asyncMiddleware(async (req, res, next) => {
    const result = await userHelper.getUserByUsernameOrEmail(req.body.emailOrUsername);
    //Check user is exist
    if (!result) {
        const error = new Error('Login failed. The username or email you\'ve entered is not registered');
        error.status = 401;
        throw error;
    }
    const match = await bcrypt.compare(req.body.password, result.password);
    if (!match) {
        const error = new Error('Login failed. The password you\'ve entered is incorrect. Try again.')
        error.status = 401;
        throw error;
    }
    const token = jwt.sign(
        {
            email: result.email,
            userId: result._id
        },
        process.env.JWT_KEY,
        {
            expiresIn: "1h"
        });
    res.status(200).json({
        message: 'Authentication successful',
        token: token
    });
});

exports.user_delete = asyncMiddleware(async (request, response, next) => {
    const userTargetId = request.params.userId;
    const userTargetIsExist = await userHelper.getUserById(userTargetId);
    if (!userTargetIsExist) {
        const error = new Error('No user entry with such ID');
        error.status = 404;
        throw error;
    }
    const userAccusor = await userHelper.getUserById(request.body.id);
    const userAccusorPassMatch = await bcrypt.compare(request.body.password, userAccusor.password);
    if (!userAccusorPassMatch) {
        const error = new Error(`The password you've entered is incorrect. Try again`);
        error.status = 401;
        throw error;
    }
    await userHelper.delete(userTargetId);
    response.status(200).json({ message: `User Account with ${userTargetId} ID has been deleted` });
});