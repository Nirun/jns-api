const request = require('supertest');
const { app, resetItems } = require('../src/app');

beforeEach(() => {
  resetItems();
});

describe('GET /items', () => {
  it('returns an empty array initially', async () => {
    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all items', async () => {
    await request(app).post('/items').send({ name: 'Item A' });
    await request(app).post('/items').send({ name: 'Item B' });
    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /items/:id', () => {
  it('returns a single item by id', async () => {
    const created = await request(app).post('/items').send({ name: 'Item A' });
    const res = await request(app).get(`/items/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Item A');
  });

  it('returns 404 for a missing item', async () => {
    const res = await request(app).get('/items/999');
    expect(res.status).toBe(404);
  });
});

describe('POST /items', () => {
  it('creates a new item', async () => {
    const res = await request(app).post('/items').send({ name: 'New Item' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, name: 'New Item' });
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/items').send({});
    expect(res.status).toBe(400);
  });
});

describe('PUT /items/:id', () => {
  it('updates an existing item', async () => {
    const created = await request(app).post('/items').send({ name: 'Old Name' });
    const res = await request(app)
      .put(`/items/${created.body.id}`)
      .send({ name: 'New Name' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New Name');
  });

  it('returns 404 for a missing item', async () => {
    const res = await request(app).put('/items/999').send({ name: 'X' });
    expect(res.status).toBe(404);
  });

  it('returns 400 when name is missing', async () => {
    const created = await request(app).post('/items').send({ name: 'Old Name' });
    const res = await request(app).put(`/items/${created.body.id}`).send({});
    expect(res.status).toBe(400);
  });
});

describe('DELETE /items/:id', () => {
  it('deletes an existing item', async () => {
    const created = await request(app).post('/items').send({ name: 'To Delete' });
    const res = await request(app).delete(`/items/${created.body.id}`);
    expect(res.status).toBe(204);
    const check = await request(app).get(`/items/${created.body.id}`);
    expect(check.status).toBe(404);
  });

  it('returns 404 for a missing item', async () => {
    const res = await request(app).delete('/items/999');
    expect(res.status).toBe(404);
  });
});
