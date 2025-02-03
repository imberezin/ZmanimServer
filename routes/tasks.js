const express = require('express');
const mysql = require('mysql');
const config = require('../config/config');
const connection = require('../config/database');

const router = express.Router();

// const connection = mysql.createConnection({
//     host: config.database.host,
//     user: config.database.user,
//     password: config.database.password,
//     database: config.database.database,
//     port: config.database.port
// });


router.post('/complete', async (req, res) => {
    try {
        const { userId, taskName } = req.body;

        if (!userId || !taskName) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'Both userId and taskName are required'
            });
        }

        const query = 'INSERT INTO tasks (userId, taskName, date, completedAt) VALUES (?, ?, NOW(), NOW())';
        connection.query(query, [userId, taskName], (error, results) => {
            if (error) {
                console.error('Error saving completed task:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to save completed task',
                    message: error.message
                });
            }

            res.json({
                success: true,
                data: results,
                message: 'Task marked as completed successfully'
            });
        });

    } catch (error) {
        console.error('Error saving completed task:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to save completed task',
            message: error.message
        });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.query;

        // Validate input
        if (!userId && !startDate && !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field',
                message: 'At least one of userId, startDate, or endDate is required'
            });
        }

        let query = 'SELECT * FROM tasks';
        const params = [];
        const conditions = [];

        // Add userId condition
        if (userId) {
            conditions.push('userId = ?');
            params.push(userId);
        }

        // Add startDate condition
        if (startDate) {
            conditions.push('date >= ?');
            params.push(startDate);
        }

        // Add endDate condition
        if (endDate) {
            conditions.push('date <= ?');
            params.push(endDate);
        }

        // Combine conditions into the query
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Add sorting
        query += ' ORDER BY date DESC';

        // Execute the query
        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Error searching tasks:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to search tasks',
                    message: error.message
                });
            }

            res.json({
                success: true,
                data: results,
                count: results.length,
                query: {
                    userId: userId || 'none',
                    startDate: startDate || 'none',
                    endDate: endDate || 'none'
                }
            });
        });

    } catch (error) {
        console.error('Error searching tasks:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to search tasks',
            message: error.message
        });
    }
});

router.get('/searchWithUser', async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.query;

        // Validate input
        if (!userId && !startDate && !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field',
                message: 'At least one of userId, startDate, or endDate is required'
            });
        }

        let query = `
            SELECT tasks.*, Users.fullName, Users.email
            FROM tasks
            LEFT JOIN Users ON tasks.userId = Users.userId
        `;
        const params = [];
        const conditions = [];

        // Add userId condition
        if (userId) {
            conditions.push('tasks.userId = ?');
            params.push(userId);
        }

        // Add startDate condition
        if (startDate) {
            conditions.push('tasks.date >= ?');
            params.push(startDate);
        }

        // Add endDate condition
        if (endDate) {
            conditions.push('tasks.date <= ?');
            params.push(endDate);
        }

        // Combine conditions into the query
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Add sorting
        query += ' ORDER BY tasks.date DESC';

        // Execute the query
        connection.query(query, params, (error, results) => {
            if (error) {
                console.error('Error searching tasks:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to search tasks',
                    message: error.message
                });
            }

            res.json({
                success: true,
                data: results,
                count: results.length,
                query: {
                    userId: userId || 'none',
                    startDate: startDate || 'none',
                    endDate: endDate || 'none'
                }
            });
        });

    } catch (error) {
        console.error('Error searching tasks:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to search tasks',
            message: error.message
        });
    }
});


// DELETE /tasks/delete
router.delete('/delete', async (req, res) => {
    try {
        const { userId, taskId } = req.body;

        if (!userId || !taskId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'Both userId and taskId are required'
            });
        }

        const query = 'DELETE FROM tasks WHERE userId = ? AND id = ?';
        connection.query(query, [userId, taskId], (error, results) => {
            if (error) {
                console.error('Error deleting task:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to delete task',
                    message: error.message
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Task not found',
                    message: 'No task found with the given userId and taskId'
                });
            }

            res.json({
                success: true,
                message: 'Task deleted successfully'
            });
        });

    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to delete task',
            message: error.message
        });
    }
});

module.exports = router;