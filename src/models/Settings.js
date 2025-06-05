import db from '../config/database.js';

class Settings {
    static async get(key) {
        return new Promise((resolve, reject) => {
            db.getConnection().get(
                'SELECT value FROM settings WHERE key = ?',
                [key],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ? row.value : null);
                }
            );
        });
    }

    static async set(key, value) {
        return new Promise((resolve, reject) => {
            db.getConnection().run(
                'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
                [key, value],
                (err) => {
                    if (err) reject(err);
                    else resolve({ success: true });
                }
            );
        });
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.getConnection().all(
                'SELECT key, value FROM settings',
                (err, rows) => {
                    if (err) reject(err);
                    else {
                        const settings = {};
                        rows.forEach(row => {
                            settings[row.key] = row.value;
                        });
                        resolve(settings);
                    }
                }
            );
        });
    }

    static async delete(key) {
        return new Promise((resolve, reject) => {
            db.getConnection().run(
                'DELETE FROM settings WHERE key = ?',
                [key],
                (err) => {
                    if (err) reject(err);
                    else resolve({ success: true });
                }
            );
        });
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

export default Settings; 