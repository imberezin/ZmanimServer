const config = require('../config/config'); // Import config

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Helper function to get date range
function getDateRange() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 5);
    
    return {
        todayString: formatDate(today),
        yesterdayString: formatDate(yesterday)
    };
}

// Helper function to build Hebcal URL
function buildHebcalUrl(startDate, endDate) {
    console.log(buildHebcalUrl)
    const params = new URLSearchParams({
        ...config.hebcal.params,
        start: startDate,
        end: endDate
    });
    console.log(params)

    return `${config.hebcal.baseUrl}?${params.toString()}`;
}


module.exports = { formatDate, getDateRange, buildHebcalUrl };