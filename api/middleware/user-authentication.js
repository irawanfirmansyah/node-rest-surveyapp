const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //Get token from header
    const token = req.headers.authorization.split(" ")[1];
    try {
        jwt.verify(token, process.env.JWT_KEY);
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Not Authorized'
        })
    }
}