const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.user_create = (request, response, next) => {
    User.findOne({
        $or: [{ username: request.body.username }, { fullName: request.body.fullName }, { email: request.body.email }]
    },
        (err, result) => {
            if (result) {
                return response.status(409).json({
                    message: `User with such username / name / email already exists`
                });
            }
            else if (err) {
                return response.status(500).json({
                    error: err
                });
            }
            else {
                bcrypt.hash(request.body.password, 10, (err, hashedPassword) => {
                    if (err) {
                        return response.status(500).json({
                            error: err
                        });
                    } else {
                        const newUser = new User({
                            _id: mongoose.Types.ObjectId(),
                            fullName: request.body.fullName,
                            username: request.body.username,
                            email: request.body.email,
                            password: hashedPassword
                        });
                        newUser.save()
                            .then(result => {
                                response.status(201).json({
                                    message: `User created`,
                                    body: result
                                });
                            })
                            .catch(err => {
                                return response.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

exports.user_login = (req, res, next) => {
    User.findOne({ $or: [{ username: req.body.emailOrUsername }, { email: req.body.emailOrUsername }] })
        .then(async (result) => {
            const match = await bcrypt.compare(req.body.password, result.password);
            if (match) {
                const token = jwt.sign(
                    {
                        email: result.email,
                        userId: result._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Authentication successful',
                    token: token
                });
            } else {
                return res.status(401).json({
                    message: 'Login failed. The password you\'ve entered is incorrect'
                });
            }
        }).catch(() => {
            return res.status(401).json({
                message: 'Login failed. The username or email you\'ve entered is doesnt exist'
            });
        })
}

exports.user_delete = (request, response, next) => {
    const id = request.params.userId;
    User.findById(id)
        .then(result => {
            if (!result) {
                return response.status(404).json({
                    error: `No user entry with such ID`
                });
            } else {
                User.findById(request.body.id)
                    .then(async (res) => {
                        const match = await bcrypt.compare(request.body.password, res.password);
                        if (match) {
                            User.deleteOne({ _id: id })
                                .then(() => {
                                    return response.status(200).json({ message: `User Account with ${id} ID has been deleted` });
                                });
                        }
                        else {
                            return response.status(401).json({
                                error: `The password you've entered is incorrect. Try again`
                            })
                        }
                    })
                    .catch(() => {
                        return response.status(500).json({
                            message: 'Internal Error'
                        })
                    })
            }
        });
}