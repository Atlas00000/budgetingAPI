require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    dbPath: process.env.DB_PATH || './data/budget.db',
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-secure-key-here'
}; 