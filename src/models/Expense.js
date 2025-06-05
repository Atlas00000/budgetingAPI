import db from '../config/database.js';

class Expense {
    static async findAll(filters = {}) {
        let query = `
            SELECT e.*, c.name as category_name 
            FROM expenses e 
            LEFT JOIN categories c ON e.category_id = c.id
        `;
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
                `SELECT e.*, c.name as category_name 
                FROM expenses e 
                LEFT JOIN categories c ON e.category_id = c.id 
                WHERE e.id = ?`,
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    static async create({ categoryId, amount, date, description, currencyCode }) {
        return new Promise((resolve, reject) => {
            db.getConnection().run(
                'INSERT INTO expenses (category_id, amount, date, description, currency_code) VALUES (?, ?, ?, ?, ?)',
                [categoryId, amount, date, description, currencyCode],
                async function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    try {
                        const expense = await this.findById(this.lastID);
                        resolve(expense);
                    } catch (error) {
                        reject(error);
                    }
                }.bind(this)
            );
        });
    }

    static async update(id, { categoryId, amount, date, description, currencyCode }) {
        return new Promise((resolve, reject) => {
            db.getConnection().run(
                'UPDATE expenses SET category_id = ?, amount = ?, date = ?, description = ?, currency_code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [categoryId, amount, date, description, currencyCode, id],
                async (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    try {
                        const expense = await this.findById(id);
                        resolve(expense);
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
                'DELETE FROM expenses WHERE id = ?',
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve({ success: true });
                }
            );
        });
    }

    static async getTotalByCategory(startDate, endDate) {
        return new Promise((resolve, reject) => {
            db.getConnection().all(
                `SELECT c.name as category_name, SUM(e.amount) as total
                FROM expenses e
                LEFT JOIN categories c ON e.category_id = c.id
                WHERE e.date BETWEEN ? AND ?
                GROUP BY e.category_id
                ORDER BY total DESC`,
                [startDate, endDate],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }
}

export default Expense; 