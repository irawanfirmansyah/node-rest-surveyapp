const User = require('../models/user');

/**
 * User Model API helpers
 */

exports.getUserById = (userId) => User.findById(userId);
exports.getUserByUsernameOrEmail = (usernameOrEmail) => User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] })
exports.create = (UserObject) => UserObject.save();
exports.delete = (userId) => User.deleteOne({ _id: userId });