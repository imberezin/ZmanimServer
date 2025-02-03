const express = require('express');
const axios = require('axios');
const { buildHebcalUrl, getDateRange } = require('../utils/dateUtils');
const config = require('../config/config');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        console.log(zmanimUrl)

        const { todayString, yesterdayString } = getDateRange();
        const zmanimUrl = buildHebcalUrl(yesterdayString, todayString);
        const response = await axios.get(zmanimUrl);
        
        res.json({
            success: true,
            data: response.data,
            dateRange: {
                from: yesterdayString,
                to: todayString
            }
        });

    } catch (error) {
        console.error('Error fetching zmanim:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch zmanim data',
            message: error.message
        });
    }
});

module.exports = router;