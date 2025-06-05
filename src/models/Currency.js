const db = require('../config/database');

class Currency {
    static async findAll() {
        const stmt = db.getConnection().prepare('SELECT * FROM currencies ORDER BY code');
        return stmt.all();
    }

    static async findById(id) {
        const stmt = db.getConnection().prepare('SELECT * FROM currencies WHERE id = ?');
        return stmt.get(id);
    }

    static async findByCode(code) {
        const stmt = db.getConnection().prepare('SELECT * FROM currencies WHERE code = ?');
        return stmt.get(code);
    }

    static async create({ code, name, exchangeRateToBase, isBase = false }) {
        const stmt = db.getConnection().prepare(
            'INSERT INTO currencies (code, name, exchange_rate_to_base, is_base) VALUES (?, ?, ?, ?)'
        );
        const result = stmt.run(code, name, exchangeRateToBase, isBase ? 1 : 0);
        return this.findById(result.lastInsertRowid);
    }

    static async update(id, { code, name, exchangeRateToBase, isBase }) {
        const stmt = db.getConnection().prepare(
            'UPDATE currencies SET code = ?, name = ?, exchange_rate_to_base = ?, is_base = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        );
        stmt.run(code, name, exchangeRateToBase, isBase ? 1 : 0, id);
        return this.findById(id);
    }

    static async delete(id) {
        const stmt = db.getConnection().prepare('DELETE FROM currencies WHERE id = ?');
        return stmt.run(id);
    }

    static async getBaseCurrency() {
        const stmt = db.getConnection().prepare('SELECT * FROM currencies WHERE is_base = 1');
        return stmt.get();
    }

    static async convertAmount(amount, fromCurrencyCode, toCurrencyCode) {
        const fromCurrency = await this.findByCode(fromCurrencyCode);
        const toCurrency = await this.findByCode(toCurrencyCode);
        
        if (!fromCurrency || !toCurrency) {
            throw new Error('Invalid currency code');
        }

        // Convert to base currency first, then to target currency
        const amountInBase = amount / fromCurrency.exchange_rate_to_base;
        return amountInBase * toCurrency.exchange_rate_to_base;
    }
}

module.exports = Currency; 