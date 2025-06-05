const request = require('supertest');
const app = require('../src/app');

// Helper to create a test category
const createTestCategory = async (name = 'Test Category', isPredefined = false) => {
    const response = await request(app)
        .post('/v1/categories')
        .send({ name, isPredefined });
    return response.body;
};

// Helper to create a test expense
const createTestExpense = async (categoryId, amount = 100, date = new Date().toISOString()) => {
    const response = await request(app)
        .post('/v1/expenses')
        .send({
            categoryId,
            amount,
            date,
            description: 'Test expense'
        });
    return response.body;
};

// Helper to create a test budget
const createTestBudget = async (categoryId, amount = 1000) => {
    const response = await request(app)
        .post('/v1/budgets')
        .send({
            categoryId,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            amount
        });
    return response.body;
};

// Helper to create a test setting
const createTestSetting = async (key, value) => {
    const response = await request(app)
        .post('/v1/settings')
        .send({ key, value });
    return response.body;
};

module.exports = {
    createTestCategory,
    createTestExpense,
    createTestBudget,
    createTestSetting
}; 