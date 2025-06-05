const fs = require('fs').promises;
const path = require('path');
const Database = require('better-sqlite3');
const { promisify } = require('util');

class DatabaseMigration {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.db = null;
    }

    async init() {
        // Create migrations table if it doesn't exist
        this.db = new Database(this.dbPath);
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    async getExecutedMigrations() {
        const stmt = this.db.prepare('SELECT name FROM migrations ORDER BY id');
        return stmt.all().map(row => row.name);
    }

    async executeMigration(migrationName, sql) {
        const stmt = this.db.prepare('INSERT INTO migrations (name) VALUES (?)');
        this.db.transaction(() => {
            this.db.exec(sql);
            stmt.run(migrationName);
        })();
    }

    async migrate() {
        try {
            await this.init();
            
            // Get all migration files
            const migrationsDir = path.join(__dirname, 'migrations');
            const files = await fs.readdir(migrationsDir);
            const migrationFiles = files
                .filter(f => f.endsWith('.sql'))
                .sort();

            // Get executed migrations
            const executedMigrations = await this.getExecutedMigrations();

            // Execute new migrations
            for (const file of migrationFiles) {
                if (!executedMigrations.includes(file)) {
                    console.log(`Executing migration: ${file}`);
                    const sql = await fs.readFile(
                        path.join(migrationsDir, file),
                        'utf8'
                    );
                    await this.executeMigration(file, sql);
                    console.log(`Completed migration: ${file}`);
                }
            }

            console.log('All migrations completed successfully');
        } catch (error) {
            console.error('Migration failed:', error);
            throw error;
        } finally {
            if (this.db) {
                this.db.close();
            }
        }
    }
}

// Export a function to run migrations
module.exports = async function migrate(dbPath) {
    const migration = new DatabaseMigration(dbPath);
    await migration.migrate();
}; 