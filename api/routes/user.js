const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/signup', (request, response, next) => {
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
                                console.log(result);
                                response.status(201).json({
                                    message: `User created`,
                                    body: result
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                response.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

router.post('/signin', (req, res, next) => {
    User.findOne({ $or: [{ username: req.body.emailOrUsername }, { email: req.body.emailOrUsername }] })
        .then(async (result) => {
            const match = await bcrypt.compare(req.body.password, result.password);
            if (match) {
                return res.status(200).json({
                    message: 'Authentication successful'
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
});

router.delete('/:userId', (request, response, next) => {
    const id = request.params.userId;
    User.findById(id)
        .then(result => {
            if (!result) {
                response.status(404).json({
                    error: `No user entry with such ID`
                });
            } else {
                User.findById(request.body.id)
                    .then(async (res) => {
                        const match = await bcrypt.compare(request.body.password, res.password);
                        if (match) {
                            User.deleteOne({ _id: id })
                                .then(() => {
                                    response.status(200).json({ message: `User Account with ${id} ID has been deleted` });
                                });
                        }
                        else {
                            return response.status(500).json({
                                error: `The password you've entered is incorrect. Try again`
                            })
                        }
                    })
            }
        });
});

module.exports = router;