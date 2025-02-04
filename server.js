// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql');
const config = require('./config/config');
const tasksRouter = require('./routes/tasks');
const zmanimRouter = require('./routes/zmanim');
const userRoute = require('./routes/userRoute');
const loginRouter = require('./routes/loginRouter'); // Path to your login route file
const connection = require('./config/database');
const app = express();

// MySQL Connection
// const connection = mysql.createConnection({
//     host: config.database.host,
//     user: config.database.user,
//     password: config.database.password,
//     database: config.database.database,
//     port: config.database.port
// });

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Routes
app.use('/zmanim', zmanimRouter);
app.use('/tasks', tasksRouter);
app.use('/api', loginRouter);
app.use('/user', userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        message: err.message
    });
});

app.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port} in ${config.server.env} mode`);
});