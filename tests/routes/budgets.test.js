const request = require('supertest');
const app = require('../../src/app');
const { createTestCategory, createTestBudget } = require('../helpers');

describe('Budget Routes', () => {
    let testCategory;
    let testBudget;

    beforeEach(async () => {
        testCategory = await createTestCategory();
        testBudget = await createTestBudget(testCategory.id);
    });

    describe('GET /v1/budgets', () => {
        it('should return all budgets', async () => {
            const response = await request(app)
                .get('/v1/budgets')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should filter budgets by month and year', async () => {
            const currentDate = new Date();
            const response = await request(app)
                .get('/v1/budgets')
                .query({
                    month: currentDate.getMonth() + 1,
                    year: currentDate.getFullYear()
                })
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.every(budget => 
                budget.month === currentDate.getMonth() + 1 &&
                budget.year === currentDate.getFullYear()
            )).toBe(true);
        });

        it('should filter budgets by category', async () => {
            const response = await request(app)
                .get('/v1/budgets')
                .query({ categoryId: testCategory.id })
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.every(budget => budget.categoryId === testCategory.id)).toBe(true);
        });
    });

    describe('GET /v1/budgets/:id', () => {
        it('should return a budget by id', async () => {
            const response = await request(app)
                .get(`/v1/budgets/${testBudget.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', testBudget.id);
            expect(response.body).toHaveProperty('categoryId', testCategory.id);
        });

        it('should return 404 for non-existent budget', async () => {
            await request(app)
                .get('/v1/budgets/999999')
                .expect(404);
        });
    });

    describe('POST /v1/budgets', () => {
        it('should create a new budget', async () => {
            const newBudget = {
                categoryId: testCategory.id,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                amount: 2000
            };

            const response = await request(app)
                .post('/v1/budgets')
                .send(newBudget)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('amount', newBudget.amount);
            expect(response.body).toHaveProperty('month', newBudget.month);
            expect(response.body).toHaveProperty('year', newBudget.year);
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/v1/budgets')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('details');
        });

        it('should prevent duplicate budgets for same category and period', async () => {
            const duplicateBudget = {
                categoryId: testCategory.id,
                month: testBudget.month,
                year: testBudget.year,
                amount: 3000
            };

            await request(app)
                .post('/v1/budgets')
                .send(duplicateBudget)
                .expect(400);
        });
    });

    describe('PUT /v1/budgets/:id', () => {
        it('should update a budget', async () => {
            const updateData = {
                amount: 2500
            };

            const response = await request(app)
                .put(`/v1/budgets/${testBudget.id}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('amount', updateData.amount);
        });

        it('should return 404 for non-existent budget', async () => {
            await request(app)
                .put('/v1/budgets/999999')
                .send({ amount: 2500 })
                .expect(404);
        });
    });

    describe('DELETE /v1/budgets/:id', () => {
        it('should delete a budget', async () => {
            await request(app)
                .delete(`/v1/budgets/${testBudget.id}`)
                .expect(204);

            // Verify budget is deleted
            await request(app)
                .get(`/v1/budgets/${testBudget.id}`)
                .expect(404);
        });

        it('should return 404 for non-existent budget', async () => {
            await request(app)
                .delete('/v1/budgets/999999')
                .expect(404);
        });
    });

    describe('GET /v1/budgets/status', () => {
        it('should return budget status for a period', async () => {
            const response = await request(app)
                .get('/v1/budgets/status')
                .query({
                    month: testBudget.month,
                    year: testBudget.year
                })
                .expect(200);

            expect(response.body).toHaveProperty('budget');
            expect(response.body).toHaveProperty('spent');
            expect(response.body).toHaveProperty('remaining');
        });

        it('should require month and year parameters', async () => {
            await request(app)
                .get('/v1/budgets/status')
                .expect(400);
        });
    });
}); 