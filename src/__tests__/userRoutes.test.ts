import { createServer } from 'node:http';
import request from 'supertest';
import requestListener from '../routes/routes';

const PORT = 4000;
const server = createServer(requestListener);

describe('User API Tests', () => {
    beforeAll(done => {
        server.listen(PORT, done);
    });

    afterAll(done => {
        server.close(done);
    });

    describe('GET /api/users', () => {
        it('should return an empty array when not users', async () => {
            const response = await request(server).get('/api/users');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should get user by id', async () => {
            const newUser = { username: 'New User', age: 25, hobbies: ['programming'] };
            const createResponse = await request(server).post('/api/users').send(newUser);

            const response = await request(server).get(`/api/users/${createResponse.body.id}`);
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(createResponse.body.id);

            await request(server).delete(`/api/users/${createResponse.body.id}`);
        });

        it('should return error when trying to get user by invalid id', async () => {
            const response = await request(server).get('/api/users/invalid-uuid');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User ID is invalid (not uuid)');
        });
    });

    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const newUser = { username: 'New User', age: 30, hobbies: ['reading', 'gaming'] };
            const response = await request(server).post('/api/users').send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.username).toBe(newUser.username);
        });

        it('should return 400 when trying to create user with missing fields', async () => {
            const response = await request(server).post('/api/users').send({ username: 'IncompleteUser' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid request. Missing required fields');
        });
    });

    describe('PUT /api/users/{userId}', () => {
        it('should update the created user', async () => {
            const newUser = { username: 'UpdateUser', age: 28, hobbies: ['reading'] };
            const createResponse = await request(server).post('/api/users').send(newUser);

            const updatedUser = { username: 'UpdatedUser', age: 30, hobbies: ['gaming'] };
            const response = await request(server).put(`/api/users/${createResponse.body.id}`).send(updatedUser);

            expect(response.status).toBe(200);
            expect(response.body.username).toBe(updatedUser.username);
        });

        it('should return error when trying to update user with invalid id', async () => {
            const updatedUser = { username: 'InvalidUpdate', age: 30, hobbies: ['reading'] };
            const response = await request(server).put('/api/users/invalid-uuid').send(updatedUser);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User ID is invalid (not uuid)');
        });
    });

    describe('DELETE /api/users/{userId}', () => {
        it('should delete a created user', async () => {
            const newUser = { username: 'DeleteMe', age: 22, hobbies: ['hiking'] };
            const createResponse = await request(server).post('/api/users').send(newUser);

            const response = await request(server).delete(`/api/users/${createResponse.body.id}`);
            expect(response.status).toBe(204);

            const verifyResponse = await request(server).get(`/api/users/${createResponse.body.id}`);
            expect(verifyResponse.status).toBe(404);
        });

        it('should return error when trying delete user with invalid id', async () => {
            const response = await request(server).delete('/api/users/invalid-uuid');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User ID is invalid (not uuid)');
        });

        it('should return error when trying delete non-existent user', async () => {
            const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
            const response = await request(server).delete(`/api/users/${nonExistentId}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });
    });

    describe('Unsupported Methods on /api/users', () => {
        it('should return 405 when using unsupported HTTP method on /api/users', async () => {
            const response = await request(server).patch('/api/users');
            expect(response.status).toBe(405);
            expect(response.body.message).toBe('Method not allowed');
        });
    });
});
