const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_PATH = path.join(__dirname, '../data/test.db');

// Ensure test database directory exists
const dbDir = path.dirname(process.env.DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Database cleanup
const cleanupDatabase = () => {
    if (fs.existsSync(process.env.DB_PATH)) {
        fs.unlinkSync(process.env.DB_PATH);
    }
};

// Initialize test database
const initializeDatabase = () => {
    // Add any database initialization logic here
    // For example, creating tables, inserting test data, etc.
};

// Global test setup
beforeAll(() => {
    cleanupDatabase();
    initializeDatabase();
});

// Global test teardown
afterAll(() => {
    cleanupDatabase();
});

// Reset database between tests
beforeEach(() => {
    cleanupDatabase();
    initializeDatabase();
});

// Add custom matchers
expect.extend({
    toBeValidDate(received) {
        const pass = !isNaN(new Date(received).getTime());
        return {
            message: () => `expected ${received} to be a valid date`,
            pass
        };
    },
    toBeValidAmount(received) {
        const pass = typeof received === 'number' && !isNaN(received) && received >= 0;
        return {
            message: () => `expected ${received} to be a valid amount`,
            pass
        };
    }
}); 