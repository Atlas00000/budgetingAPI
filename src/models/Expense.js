const db = require('../config/database');
const Currency = require('./Currency');

class Expense {
    static async findAll(filters = {}) {
        let query = 'SELECT e.*, c.name as category_name, cur.code as currency_code FROM expenses e ' +
                   'JOIN categories c ON e.category_id = c.id ' +
                   'JOIN currencies cur ON e.currency_code = cur.code';
        const params = [];
        
        if (filters.startDate) {
            query += ' WHERE e.date >= ?';
            params.push(filters.startDate);
        }
        if (filters.endDate) {
            query += filters.startDate ? ' AND' : ' WHERE';
            query += ' e.date <= ?';
            params.push(filters.endDate);
        }
        if (filters.categoryId) {
            query += (filters.startDate || filters.endDate) ? ' AND' : ' WHERE';
            query += ' e.category_id = ?';
            params.push(filters.categoryId);
        }
        
        query += ' ORDER BY e.date DESC';
        
        const stmt = db.getConnection().prepare(query);
        return stmt.all(...params);
    }

    static async findById(id) {
        const stmt = db.getConnection().prepare(
            'SELECT e.*, c.name as category_name, cur.code as currency_code FROM expenses e ' +
            'JOIN categories c ON e.category_id = c.id ' +
            'JOIN currencies cur ON e.currency_code = cur.code ' +
            'WHERE e.id = ?'
        );
        return stmt.get(id);
    }

    static async create({ date, amount, currencyCode, categoryId, description = '' }) {
        const stmt = db.getConnection().prepare(
            'INSERT INTO expenses (date, amount, currency_code, category_id, description) VALUES (?, ?, ?, ?, ?)'
        );
        const result = stmt.run(date, amount, currencyCode, categoryId, description);
        return this.findById(result.lastInsertRowid);
    }

    static async update(id, { date, amount, currencyCode, categoryId, description }) {
        const stmt = db.getConnection().prepare(
            'UPDATE expenses SET date = ?, amount = ?, currency_code = ?, category_id = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        );
        stmt.run(date, amount, currencyCode, categoryId, description, id);
        return this.findById(id);
    }

    static async delete(id) {
        const stmt = db.getConnection().prepare('DELETE FROM expenses WHERE id = ?');
        return stmt.run(id);
    }

    static async getTotalByCategory(startDate, endDate) {
        const stmt = db.getConnection().prepare(`
            SELECT 
                c.name as category_name,
                SUM(e.amount) as total_amount,
                e.currency_code
            FROM expenses e
            JOIN categories c ON e.category_id = c.id
            WHERE e.date BETWEEN ? AND ?
            GROUP BY c.id, e.currency_code
            ORDER BY total_amount DESC
        `);
        return stmt.all(startDate, endDate);
    }

    static async getTotalByDateRange(startDate, endDate, targetCurrencyCode) {
        const expenses = await this.findAll({ startDate, endDate });
        let total = 0;

        for (const expense of expenses) {
            if (expense.currency_code === targetCurrencyCode) {
                total += expense.amount;
            } else {
                const convertedAmount = await Currency.convertAmount(
                    expense.amount,
                    expense.currency_code,
                    targetCurrencyCode
                );
                total += convertedAmount;
            }
        }

        return total;
    }
}

module.exports = Expense; 