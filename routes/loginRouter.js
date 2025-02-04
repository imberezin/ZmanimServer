const express = require('express');
const mysql = require('mysql');
const config = require('../config/config');
const connection = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'Email and password are required'
            });
        }

        // Fetch user from the database
        const query = 'SELECT * FROM Users WHERE email = ?';
        connection.query(query, [email], async (error, results) => {
            if (error) {
                console.error('Error fetching user:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to fetch user',
                    message: error.message
                });
            }

            // Check if user exists
            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: 'No user found with the provided email'
                });
            }

            const user = results[0];

            // Compare the provided password with the hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials',
                    message: 'Incorrect password'
                });
            }

            const token = jwt.sign(
                { userId: user.userId, email: user.email },
                config.jwtSecret, // Replace with a strong secret key
                { expiresIn: config.jwtExpiration } // Token expires in 24 hour
            );
            
            // Login successful
            res.json({
                success: true,
                message: 'Login successful',
                token: token, // Include the token in the response
                data: {
                    userId: user.userId,
                    fullName: user.fullName,
                    email: user.email
                }
            });
        });

    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to log in',
            message: error.message
        });
    }
});

module.exports = router;