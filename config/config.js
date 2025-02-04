require('dotenv').config();

const config = {
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },
    
    database: {
        host: process.env.DB_HOST || 'wc8gr.h.filess.io',
        user: process.env.DB_USER || 'zmanin_something',
        password: process.env.DB_PASSWORD || '09b2ef6f0849d71a3fab20613ffc22a538ece425',
        database: process.env.DB_NAME || 'zmanin_something',
        port: process.env.DB_PORT || '3306'
    },
    
    hebcal: {
        baseUrl: 'https://www.hebcal.com/hebcal',
        params: {
            v: '1',
            cfg: 'json',
            maj: 'on',
            min: 'on',
            mod: 'on',
            nx: 'on',
            ss: 'on',
            mf: 'on',
            c: 'on',
            geo: 'none=3448439',
            M: 'on',
            s: 'on',
            dps: 'on',
            dr1: 'on',
            F: 'on',
            lg: 'he-x-NoNikud',
            myomi: 'on',
            dty: 'on',
            yyomi: 'on'
        }
    },
    
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST']
    },
    jwtSecret: 'Israel_Berezin_App_123!', // Replace with a strong, random key
    jwtExpiration: '24h' // Token expiration time (e.g., 1 hour)

};

module.exports = config;

// module.exports = {
//     jwtSecret: 'your_secret_key_here', // Replace with a strong, random key
//     jwtExpiration: '1h' // Token expiration time (e.g., 1 hour)
// };
