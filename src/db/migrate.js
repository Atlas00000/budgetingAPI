import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate(dbPath) {
    const db = new sqlite3.Database(dbPath);

    // Create tables if they don't exist
    await new Promise((resolve, reject) => {
        db.serialize(() => {
            // Categories table
            db.run(`
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    is_predefined BOOLEAN DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Expenses table
            db.run(`
                CREATE TABLE IF NOT EXISTS expenses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    category_id INTEGER,
                    amount REAL NOT NULL,
                    date TEXT NOT NULL,
                    description TEXT,
                    currency_code TEXT DEFAULT 'USD',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories (id)
                )
            `);

            // Budgets table
            db.run(`
                CREATE TABLE IF NOT EXISTS budgets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    category_id INTEGER,
                    month INTEGER NOT NULL,
                    year INTEGER NOT NULL,
                    amount REAL NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories (id),
                    UNIQUE(category_id, month, year)
                )
            `);

            // Settings table
            db.run(`
                CREATE TABLE IF NOT EXISTS settings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    key TEXT NOT NULL UNIQUE,
                    value TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Insert default settings if they don't exist
            db.run(`
                INSERT OR IGNORE INTO settings (key, value) VALUES
                ('base_currency', 'USD'),
                ('date_format', 'YYYY-MM-DD')
            `);

            // Insert predefined categories if they don't exist
            db.run(`
                INSERT OR IGNORE INTO categories (name, is_predefined) VALUES
                ('Food & Dining', 1),
                ('Transportation', 1),
                ('Housing', 1),
                ('Utilities', 1),
                ('Entertainment', 1),
                ('Shopping', 1),
                ('Healthcare', 1),
                ('Education', 1),
                ('Personal Care', 1),
                ('Travel', 1)
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    // Close the database connection
    await new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

export default migrate; 