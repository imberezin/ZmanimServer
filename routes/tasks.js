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

        if (!userId && !startDate || !userId && !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field',
                message: 'userId and startDate and endDate are required'
            });
        }

        let query = ''
        const params = [];

        if (userId){
            query = 'SELECT * FROM tasks WHERE userId = ?';
            params.push(userId);

        }else{
            query = 'SELECT * FROM tasks WHERE';

        }
        if (startDate || endDate) {
            if (startDate) {
                if (userId){
                query += ' AND date >= ?';
                }else{
                    query += ' date >= ?';
                }
                params.push(startDate);
            }
            if (endDate) {
                query += ' AND date <= ?';
                params.push(endDate);
            }
        }

        query += ' ORDER BY date DESC';

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
                    userId,
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