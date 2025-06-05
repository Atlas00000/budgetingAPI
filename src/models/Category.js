const db = require('../config/database');

class Category {
    static async findAll() {
        const stmt = db.getConnection().prepare('SELECT * FROM categories ORDER BY name');
        return stmt.all();
    }

    static async findById(id) {
        const stmt = db.getConnection().prepare('SELECT * FROM categories WHERE id = ?');
        return stmt.get(id);
    }

    static async create({ name, isPredefined = false }) {
        const stmt = db.getConnection().prepare(
            'INSERT INTO categories (name, is_predefined) VALUES (?, ?)'
        );
        const result = stmt.run(name, isPredefined ? 1 : 0);
        return this.findById(result.lastInsertRowid);
    }

    static async update(id, { name, isPredefined }) {
        const stmt = db.getConnection().prepare(
            'UPDATE categories SET name = ?, is_predefined = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        );
        stmt.run(name, isPredefined ? 1 : 0, id);
        return this.findById(id);
    }

    static async delete(id) {
        const stmt = db.getConnection().prepare('DELETE FROM categories WHERE id = ?');
        return stmt.run(id);
    }

    static async findPredefined() {
        const stmt = db.getConnection().prepare(
            'SELECT * FROM categories WHERE is_predefined = 1 ORDER BY name'
        );
        return stmt.all();
    }

    static async findCustom() {
        const stmt = db.getConnection().prepare(
            'SELECT * FROM categories WHERE is_predefined = 0 ORDER BY name'
        );
        return stmt.all();
    }
}

module.exports = Category; 