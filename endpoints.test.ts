// endpoints.test.ts

const request = require('supertest')
// const { bots } = require('./data.js')

it('GET: /api/robots should return status 200', async () => {
    const res = await request('http://localhost:3000').get('/api/robots');
    expect(res.status).toEqual(200);
});