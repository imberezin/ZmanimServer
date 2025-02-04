const jwt = require('jsonwebtoken');
const config = require('../config/config'); // Your configuration file

const authMiddleware = (req, res, next) => {
    // Get the token from the request headers
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied',
            message: 'No token provided'
        });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error verifying token:', error.message);
        res.status(401).json({
            success: false,
            error: 'Invalid token',
            message: 'Token is invalid or expired'
        });
    }
};

module.exports = authMiddleware;