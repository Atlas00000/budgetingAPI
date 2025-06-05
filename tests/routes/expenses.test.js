const request = require('supertest');
const app = require('../../src/app');
const { createTestCategory, createTestExpense } = require('../helpers');

describe('Expense Routes', () => {
    let testCategory;
    let testExpense;

    beforeEach(async () => {
        testCategory = await createTestCategory();
        testExpense = await createTestExpense(testCategory.id);
    });

    describe('GET /v1/expenses', () => {
        it('should return all expenses', async () => {
            const response = await request(app)
                .get('/v1/expenses')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should filter expenses by date range', async () => {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 1);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);

            const response = await request(app)
                .get('/v1/expenses')
                .query({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                })
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should filter expenses by category', async () => {
            const response = await request(app)
                .get('/v1/expenses')
                .query({ categoryId: testCategory.id })
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.every(exp => exp.categoryId === testCategory.id)).toBe(true);
        });
    });

    describe('GET /v1/expenses/:id', () => {
        it('should return an expense by id', async () => {
            const response = await request(app)
                .get(`/v1/expenses/${testExpense.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', testExpense.id);
            expect(response.body).toHaveProperty('categoryId', testCategory.id);
        });

        it('should return 404 for non-existent expense', async () => {
            await request(app)
                .get('/v1/expenses/999999')
                .expect(404);
        });
    });

    describe('POST /v1/expenses', () => {
        it('should create a new expense', async () => {
            const newExpense = {
                categoryId: testCategory.id,
                amount: 150,
                date: new Date().toISOString(),
                description: 'New test expense'
            };

            const response = await request(app)
                .post('/v1/expenses')
                .send(newExpense)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('amount', newExpense.amount);
            expect(response.body).toHaveProperty('description', newExpense.description);
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/v1/expenses')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('details');
        });
    });

    describe('PUT /v1/expenses/:id', () => {
        it('should update an expense', async () => {
            const updateData = {
                amount: 200,
                description: 'Updated expense'
            };

            const response = await request(app)
                .put(`/v1/expenses/${testExpense.id}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('amount', updateData.amount);
            expect(response.body).toHaveProperty('description', updateData.description);
        });

        it('should return 404 for non-existent expense', async () => {
            await request(app)
                .put('/v1/expenses/999999')
                .send({ amount: 200 })
                .expect(404);
        });
    });

    describe('DELETE /v1/expenses/:id', () => {
        it('should delete an expense', async () => {
            await request(app)
                .delete(`/v1/expenses/${testExpense.id}`)
                .expect(204);

            // Verify expense is deleted
            await request(app)
                .get(`/v1/expenses/${testExpense.id}`)
                .expect(404);
        });

        it('should return 404 for non-existent expense', async () => {
            await request(app)
                .delete('/v1/expenses/999999')
                .expect(404);
        });
    });

    describe('GET /v1/expenses/category/:categoryId', () => {
        it('should return expenses for a category', async () => {
            const response = await request(app)
                .get(`/v1/expenses/category/${testCategory.id}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.every(exp => exp.categoryId === testCategory.id)).toBe(true);
        });
    });

    describe('GET /v1/expenses/total', () => {
        it('should return total expenses for a date range', async () => {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 1);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);

            const response = await request(app)
                .get('/v1/expenses/total')
                .query({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                })
                .expect(200);

            expect(response.body).toHaveProperty('total');
            expect(typeof response.body.total).toBe('number');
        });
    });
}); 