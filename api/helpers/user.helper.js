const User = require('../models/user');

exports.getUserById = (userId) => {
    return User.findById(userId);
}