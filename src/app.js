const express = require('express');

const app = express();
app.use(express.json());

const items = [];
let nextId = 1;

app.get('/items', (req, res) => {
  res.json(items);
});

app.get('/items/:id', (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id, 10));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  return res.json(item);
});

app.post('/items', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const item = { id: nextId++, name };
  items.push(item);
  return res.status(201).json(item);
});

app.put('/items/:id', (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id, 10));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  item.name = name;
  return res.json(item);
});

app.delete('/items/:id', (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id, 10));
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  items.splice(index, 1);
  return res.status(204).send();
});

module.exports = { app, resetItems: () => { items.length = 0; nextId = 1; } };
