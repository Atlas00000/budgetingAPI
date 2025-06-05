import db from '../config/database.js';
import Expense from './Expense.js';

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

        return new Promise((resolve, reject) => {
            db.getConnection().all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.getConnection().get(
                `SELECT b.*, c.name as category_name 
                FROM budgets b 
                LEFT JOIN categories c ON b.category_id = c.id 
                WHERE b.id = ?`,
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    static async create({ categoryId, month, year, amount }) {
        return new Promise((resolve, reject) => {
            db.getConnection().run(
                'INSERT INTO budgets (category_id, month, year, amount) VALUES (?, ?, ?, ?)',
                [categoryId, month, year, amount],
                async function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    try {
                        const budget = await this.findById(this.lastID);
                        resolve(budget);
                    } catch (error) {
                        reject(error);
                    }
                }.bind(this)
            );
        });
    }

    static async update(id, { categoryId, month, year, amount }) {
        return new Promise((resolve, reject) => {
            db.getConnection().run(
                'UPDATE budgets SET category_id = ?, month = ?, year = ?, amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [categoryId, month, year, amount, id],
                async (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    try {
                        const budget = await this.findById(id);
                        resolve(budget);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.getConnection().run(
                'DELETE FROM budgets WHERE id = ?',
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve({ success: true });
                }
            );
        });
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

        return new Promise((resolve, reject) => {
            db.getConnection().get(budgetQuery, budgetParams, async (err, budget) => {
                if (err) {
                    console.error('Error getting budget:', err);
                    reject(err);
                    return;
                }

                if (!budget) {
                    console.log('No budget found for:', { month, year, categoryId });
                    resolve(null);
                    return;
                }

                try {
                    // Get expenses
                    const expenses = await Expense.findAll({
                        startDate,
                        endDate,
                        categoryId
                    });

                    // Calculate total spent (default to 0 if no expenses)
                    const totalSpent = expenses ? expenses.reduce((sum, expense) => sum + expense.amount, 0) : 0;

                    const status = {
                        budget: budget.amount,
                        spent: totalSpent,
                        remaining: budget.amount - totalSpent,
                        percentageUsed: (totalSpent / budget.amount) * 100
                    };

                    console.log('Budget status calculated:', status);
                    resolve(status);
                } catch (error) {
                    console.error('Error calculating budget status:', error);
                    reject(error);
                }
            });
        });
    }
}

export default Budget; 