const Database = require('better-sqlite3');
const path = require('path');
const migrate = require('../db/migrate');

class DatabaseConfig {
    constructor() {
        this.db = null;
        this.dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/budget.db');
    }

    async initialize() {
        try {
            // Ensure data directory exists
            const dataDir = path.dirname(this.dbPath);
            await require('fs').promises.mkdir(dataDir, { recursive: true });

            // Initialize database with encryption if key is provided
            const options = {
                verbose: process.env.NODE_ENV === 'development' ? console.log : null
            };

            if (process.env.DB_ENCRYPTION_KEY) {
                options.encryptionKey = process.env.DB_ENCRYPTION_KEY;
            }

            this.db = new Database(this.dbPath, options);

            // Run migrations
            await migrate(this.dbPath);

            // Enable foreign keys
            this.db.pragma('foreign_keys = ON');

            // Configure database
            this.db.pragma('journal_mode = WAL');
            this.db.pragma('synchronous = NORMAL');

            console.log('Database initialized successfully');
            return this.db;
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    getConnection() {
        if (!this.db) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.db;
    }

    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

// Export a singleton instance
const dbConfig = new DatabaseConfig();
module.exports = dbConfig; 