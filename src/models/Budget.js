const db = require('../config/database');
const Expense = require('./Expense');

class Budget {
    static async findAll(filters = {}) {
        let query = `
            SELECT b.*, c.name as category_name 
            FROM budgets b 
            LEFT JOIN categories c ON b.category_id = c.id
        `;
        const params = [];

        if (filters.month) {
            query += ' WHERE b.month = ?';
            params.push(filters.month);
        }
        if (filters.year) {
            query += filters.month ? ' AND' : ' WHERE';
            query += ' b.year = ?';
            params.push(filters.year);
        }
        if (filters.categoryId) {
            query += (filters.month || filters.year) ? ' AND' : ' WHERE';
            query += ' b.category_id = ?';
            params.push(filters.categoryId);
        }

        query += ' ORDER BY b.year DESC, b.month DESC';

        const stmt = db.getConnection().prepare(query);
        return stmt.all(...params);
    }

    static async findById(id) {
        const stmt = db.getConnection().prepare(`
            SELECT b.*, c.name as category_name 
            FROM budgets b 
            LEFT JOIN categories c ON b.category_id = c.id 
            WHERE b.id = ?
        `);
        return stmt.get(id);
    }

    static async create({ categoryId, month, year, amount }) {
        const stmt = db.getConnection().prepare(
            'INSERT INTO budgets (category_id, month, year, amount) VALUES (?, ?, ?, ?)'
        );
        const result = stmt.run(categoryId, month, year, amount);
        return this.findById(result.lastInsertRowid);
    }

    static async update(id, { categoryId, month, year, amount }) {
        const stmt = db.getConnection().prepare(
            'UPDATE budgets SET category_id = ?, month = ?, year = ?, amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        );
        stmt.run(categoryId, month, year, amount, id);
        return this.findById(id);
    }

    static async delete(id) {
        const stmt = db.getConnection().prepare('DELETE FROM budgets WHERE id = ?');
        return stmt.run(id);
    }

    static async getBudgetStatus(month, year, categoryId = null) {
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

        // Get budget
        const budgetQuery = categoryId 
            ? 'SELECT * FROM budgets WHERE month = ? AND year = ? AND category_id = ?'
            : 'SELECT * FROM budgets WHERE month = ? AND year = ? AND category_id IS NULL';
        const budgetParams = categoryId 
            ? [month, year, categoryId]
            : [month, year];
        const budgetStmt = db.getConnection().prepare(budgetQuery);
        const budget = budgetStmt.get(...budgetParams);

        if (!budget) {
            return null;
        }

        // Get expenses
        const expenses = await Expense.findAll({
            startDate,
            endDate,
            categoryId
        });

        // Calculate total spent
        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        return {
            budget: budget.amount,
            spent: totalSpent,
            remaining: budget.amount - totalSpent,
            percentageUsed: (totalSpent / budget.amount) * 100
        };
    }
}

module.exports = Budget; 