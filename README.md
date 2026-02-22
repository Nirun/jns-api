# jns-api

A simple Node.js REST API built with Express.

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npm start
```

The server runs on port `3000` by default (configurable via the `PORT` environment variable).

## API Endpoints

| Method | Path         | Description          |
|--------|--------------|----------------------|
| GET    | /items       | List all items       |
| GET    | /items/:id   | Get an item by ID    |
| POST   | /items       | Create a new item    |
| PUT    | /items/:id   | Update an item       |
| DELETE | /items/:id   | Delete an item       |

### Example request body (POST / PUT)

```json
{ "name": "My Item" }
```

## Running Tests

```bash
npm test
```
