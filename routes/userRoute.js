const express = require('express');
const mysql = require('mysql');
const config = require('../config/config');
const connection = require('../config/database');
const bcrypt = require('bcrypt');

const router = express.Router();


// Add a new user
router.post('/create', async (req, res) => {
    try {
        const { userId, fullName, email, password } = req.body;

        // Validate input
        if (!userId || !fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'userId, fullName, ,password and email are required'
            });
        }

        const saltRounds = 10; // Number of salt rounds (recommended: 10)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user into the database
        const query = 'INSERT INTO Users (userId, fullName, email, password) VALUES (?, ?, ?, ?)';
        const params = [userId, fullName, email, hashedPassword];
        
        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Error adding user:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to add user',
                    message: error.message
                });
            }

            res.status(201).json({
                success: true,
                message: 'User added successfully',
                data: { userId, fullName, email }
            });
        });

    } catch (error) {
        console.error('Error adding user:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to add user',
            message: error.message
        });
    }
});

// Get user by name
router.get('/getUserByName/name/:fullName', async (req, res) => {
    try {
        const { fullName } = req.params;

        // Query the database for users with the specified name
        const query = 'SELECT * FROM Users WHERE fullName = ?';
        const params = [fullName];

        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Error fetching user by name:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to fetch user by name',
                    message: error.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: `No user found with name: ${fullName}`
                });
            }

            res.json({
                success: true,
                data: results
            });
        });

    } catch (error) {
        console.error('Error fetching user by name:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user by name',
            message: error.message
        });
    }
});

// Get user by ID
router.get('/getUserById/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Query the database for the user with the specified ID
        const query = 'SELECT * FROM Users WHERE userId = ?';
        const params = [userId];

        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Error fetching user by ID:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to fetch user by ID',
                    message: error.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: `No user found with ID: ${userId}`
                });
            }

            res.json({
                success: true,
                data: results[0]
            });
        });

    } catch (error) {
        console.error('Error fetching user by ID:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user by ID',
            message: error.message
        });
    }
});

// Update an existing user
router.put('/update/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, email } = req.body;

        // Validate input
        if (!fullName && !email) {
            return res.status(400).json({
                success: false,
                error: 'Missing fields to update',
                message: 'At least one of fullName or email is required'
            });
        }

        // Build the update query dynamically
        let query = 'UPDATE Users SET ';
        const params = [];
        const updates = [];

        if (fullName) {
            updates.push('fullName = ?');
            params.push(fullName);
        }
        if (email) {
            updates.push('email = ?');
            params.push(email);
        }

        query += updates.join(', ') + ' WHERE userId = ?';
        params.push(userId);

        // Execute the update query
        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Error updating user:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to update user',
                    message: error.message
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: `No user found with ID: ${userId}`
                });
            }

            res.json({
                success: true,
                message: 'User updated successfully',
                data: { userId, fullName, email }
            });
        });

    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to update user',
            message: error.message
        });
    }
});

// Delete a user - ON DELETE CASCADE (route remains simple, as the database handles the task deletion automatically)
router.delete('/delete/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Delete the user (tasks will be deleted automatically due to ON DELETE CASCADE)
        const deleteUserQuery = 'DELETE FROM Users WHERE userId = ?';
        connection.query(deleteUserQuery, [userId], (error, results) => {
            if (error) {
                console.error('Error deleting user:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to delete user',
                    message: error.message
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: `No user found with ID: ${userId}`
                });
            }

            res.json({
                success: true,
                message: 'User and all associated tasks deleted successfully'
            });
        });

    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user',
            message: error.message
        });
    }
});


//If you don't want to use ON DELETE CASCADE, you can modify the DELETE /users/:userId route to explicitly delete the user's tasks before deleting the user.
router.delete('/deleteManuallyUser/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Step 1: Delete all tasks associated with the user
        const deleteTasksQuery = 'DELETE FROM tasks WHERE userId = ?';
        connection.query(deleteTasksQuery, [userId], (error, taskResults) => {
            if (error) {
                console.error('Error deleting tasks:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to delete tasks',
                    message: error.message
                });
            }

            // Step 2: Delete the user
            const deleteUserQuery = 'DELETE FROM Users WHERE userId = ?';
            connection.query(deleteUserQuery, [userId], (error, userResults) => {
                if (error) {
                    console.error('Error deleting user:', error);
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to delete user',
                        message: error.message
                    });
                }

                if (userResults.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        error: 'User not found',
                        message: `No user found with ID: ${userId}`
                    });
                }

                res.json({
                    success: true,
                    message: 'User and all associated tasks deleted successfully'
                });
            });
        });

    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user',
            message: error.message
        });
    }
});
// Delete only user  user
router.delete('/deleteOnlyUser/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Delete the user from the database
        const query = 'DELETE FROM Users WHERE userId = ?';
        const params = [userId];

        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Error deleting user:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to delete user',
                    message: error.message
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: `No user found with ID: ${userId}`
                });
            }

            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        });

    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user',
            message: error.message
        });
    }
});

router.put('/updatePassword/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field',
                message: 'New password is required'
            });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the password in the database
        const query = 'UPDATE Users SET password = ? WHERE userId = ?';
        connection.query(query, [hashedPassword, userId], (error, results) => {
            if (error) {
                console.error('Error updating password:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to update password',
                    message: error.message
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: `No user found with ID: ${userId}`
                });
            }

            res.json({
                success: true,
                message: 'Password updated successfully'
            });
        });

    } catch (error) {
        console.error('Error updating password:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to update password',
            message: error.message
        });
    }
});


module.exports = router;