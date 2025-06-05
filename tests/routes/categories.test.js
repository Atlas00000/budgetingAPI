const request = require('supertest');
const app = require('../../src/app');
const { createTestCategory } = require('../helpers');

describe('Category Routes', () => {
    let testCategory;

    beforeEach(async () => {
        testCategory = await createTestCategory();
    });

    describe('GET /v1/categories', () => {
        it('should return all categories', async () => {
            const response = await request(app)
                .get('/v1/categories')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /v1/categories/:id', () => {
        it('should return a category by id', async () => {
            const response = await request(app)
                .get(`/v1/categories/${testCategory.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', testCategory.id);
            expect(response.body).toHaveProperty('name', testCategory.name);
        });

        it('should return 404 for non-existent category', async () => {
            await request(app)
                .get('/v1/categories/999999')
                .expect(404);
        });
    });

    describe('POST /v1/categories', () => {
        it('should create a new category', async () => {
            const newCategory = {
                name: 'New Test Category',
                isPredefined: false
            };

            const response = await request(app)
                .post('/v1/categories')
                .send(newCategory)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name', newCategory.name);
            expect(response.body).toHaveProperty('isPredefined', newCategory.isPredefined);
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/v1/categories')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('details');
        });

        it('should prevent duplicate category names', async () => {
            await request(app)
                .post('/v1/categories')
                .send({ name: testCategory.name })
                .expect(400);
        });
    });

    describe('PUT /v1/categories/:id', () => {
        it('should update a category', async () => {
            const updateData = {
                name: 'Updated Category Name'
            };

            const response = await request(app)
                .put(`/v1/categories/${testCategory.id}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('name', updateData.name);
        });

        it('should return 404 for non-existent category', async () => {
            await request(app)
                .put('/v1/categories/999999')
                .send({ name: 'Updated Name' })
                .expect(404);
        });
    });

    describe('DELETE /v1/categories/:id', () => {
        it('should delete a category', async () => {
            await request(app)
                .delete(`/v1/categories/${testCategory.id}`)
                .expect(204);

            // Verify category is deleted
            await request(app)
                .get(`/v1/categories/${testCategory.id}`)
                .expect(404);
        });

        it('should return 404 for non-existent category', async () => {
            await request(app)
                .delete('/v1/categories/999999')
                .expect(404);
        });
    });

    describe('GET /v1/categories/predefined', () => {
        it('should return predefined categories', async () => {
            // Create a predefined category
            await createTestCategory('Predefined Category', true);

            const response = await request(app)
                .get('/v1/categories/predefined')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.every(cat => cat.isPredefined)).toBe(true);
        });
    });

    describe('GET /v1/categories/custom', () => {
        it('should return custom categories', async () => {
            const response = await request(app)
                .get('/v1/categories/custom')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.every(cat => !cat.isPredefined)).toBe(true);
        });
    });
}); 