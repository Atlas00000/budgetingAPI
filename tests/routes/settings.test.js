const request = require('supertest');
const app = require('../../src/app');
const { createTestSetting } = require('../helpers');

describe('Settings Routes', () => {
    describe('GET /v1/settings', () => {
        it('should return all settings', async () => {
            const response = await request(app)
                .get('/v1/settings')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /v1/settings/:key', () => {
        it('should return a setting by key', async () => {
            const testSetting = await createTestSetting('test_key', 'test_value');

            const response = await request(app)
                .get(`/v1/settings/${testSetting.key}`)
                .expect(200);

            expect(response.body).toHaveProperty('key', testSetting.key);
            expect(response.body).toHaveProperty('value', testSetting.value);
        });

        it('should return 404 for non-existent setting', async () => {
            await request(app)
                .get('/v1/settings/non_existent_key')
                .expect(404);
        });
    });

    describe('POST /v1/settings', () => {
        it('should create a new setting', async () => {
            const newSetting = {
                key: 'new_setting',
                value: 'new_value'
            };

            const response = await request(app)
                .post('/v1/settings')
                .send(newSetting)
                .expect(200);

            expect(response.body).toHaveProperty('key', newSetting.key);
            expect(response.body).toHaveProperty('value', newSetting.value);
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/v1/settings')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('details');
        });
    });

    describe('DELETE /v1/settings/:key', () => {
        it('should delete a setting', async () => {
            const testSetting = await createTestSetting('delete_test', 'value');

            await request(app)
                .delete(`/v1/settings/${testSetting.key}`)
                .expect(204);

            // Verify setting is deleted
            await request(app)
                .get(`/v1/settings/${testSetting.key}`)
                .expect(404);
        });
    });

    describe('GET /v1/settings/currency/base', () => {
        it('should return base currency setting', async () => {
            const response = await request(app)
                .get('/v1/settings/currency/base')
                .expect(200);

            expect(response.body).toHaveProperty('baseCurrency');
            expect(typeof response.body.baseCurrency).toBe('string');
        });
    });

    describe('POST /v1/settings/currency/base', () => {
        it('should set base currency', async () => {
            const response = await request(app)
                .post('/v1/settings/currency/base')
                .send({ currencyCode: 'EUR' })
                .expect(200);

            expect(response.body).toHaveProperty('baseCurrency', 'EUR');
        });

        it('should validate currency code format', async () => {
            const response = await request(app)
                .post('/v1/settings/currency/base')
                .send({ currencyCode: 'INVALID' })
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('details');
        });
    });

    describe('GET /v1/settings/date/format', () => {
        it('should return date format setting', async () => {
            const response = await request(app)
                .get('/v1/settings/date/format')
                .expect(200);

            expect(response.body).toHaveProperty('dateFormat');
            expect(typeof response.body.dateFormat).toBe('string');
        });
    });

    describe('POST /v1/settings/date/format', () => {
        it('should set date format', async () => {
            const response = await request(app)
                .post('/v1/settings/date/format')
                .send({ format: 'YYYY-MM-DD' })
                .expect(200);

            expect(response.body).toHaveProperty('dateFormat', 'YYYY-MM-DD');
        });

        it('should validate format length', async () => {
            const response = await request(app)
                .post('/v1/settings/date/format')
                .send({ format: 'a'.repeat(51) })
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('details');
        });
    });
}); 