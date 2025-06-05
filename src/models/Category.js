import db from '../config/database.js';

class Category {
    static async findAll() {
        return new Promise((resolve, reject) => {
            db.getConnection().all(
                'SELECT * FROM categories ORDER BY name',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.getConnection().get(
                'SELECT * FROM categories WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    static async create({ name, isPredefined = false }) {
        return new Promise((resolve, reject) => {
            db.getConnection().run(
                'INSERT INTO categories (name, is_predefined) VALUES (?, ?)',
                [name, isPredefined],
                async function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    try {
                        const category = await this.findById(this.lastID);
                        resolve(category);
                    } catch (error) {
                        reject(error);
                    }
                }.bind(this)
            );
        });
    }

    static async update(id, { name, isPredefined }) {
        return new Promise((resolve, reject) => {
            db.getConnection().run(
                'UPDATE categories SET name = ?, is_predefined = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [name, isPredefined, id],
                async (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    try {
                        const category = await this.findById(id);
                        resolve(category);
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
                'DELETE FROM categories WHERE id = ? AND is_predefined = 0',
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve({ success: true });
                }
            );
        });
    }

    static async findPredefined() {
        const db = await this.getDb();
        return db.all('SELECT * FROM categories WHERE is_predefined = 1 ORDER BY name');
    }

    static async findCustom() {
        const db = await this.getDb();
        return db.all('SELECT * FROM categories WHERE is_predefined = 0 ORDER BY name');
    }

    static async getDb() {
        return db.getConnection();
    }
}

export default Category; 