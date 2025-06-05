const db = require('../config/database');

class Settings {
    static async get(key) {
        const stmt = db.getConnection().prepare('SELECT value FROM settings WHERE key = ?');
        const result = stmt.get(key);
        return result ? result.value : null;
    }

    static async set(key, value) {
        const stmt = db.getConnection().prepare(`
            INSERT INTO settings (key, value) 
            VALUES (?, ?) 
            ON CONFLICT(key) DO UPDATE SET 
                value = excluded.value,
                updated_at = CURRENT_TIMESTAMP
        `);
        stmt.run(key, value);
        return this.get(key);
    }

    static async getAll() {
        const stmt = db.getConnection().prepare('SELECT key, value FROM settings');
        const results = stmt.all();
        return results.reduce((acc, { key, value }) => {
            acc[key] = value;
            return acc;
        }, {});
    }

    static async delete(key) {
        const stmt = db.getConnection().prepare('DELETE FROM settings WHERE key = ?');
        return stmt.run(key);
    }

    // Helper methods for common settings
    static async getBaseCurrency() {
        return this.get('base_currency');
    }

    static async setBaseCurrency(currencyCode) {
        return this.set('base_currency', currencyCode);
    }

    static async getDefaultCurrency() {
        return this.get('default_currency') || this.getBaseCurrency();
    }

    static async setDefaultCurrency(currencyCode) {
        return this.set('default_currency', currencyCode);
    }

    static async getDateFormat() {
        return this.get('date_format') || 'YYYY-MM-DD';
    }

    static async setDateFormat(format) {
        return this.set('date_format', format);
    }
}

module.exports = Settings; 