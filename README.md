# Sweet Shop Management System

A full-stack MERN application for managing a sweet shop inventory with authentication, CRUD operations, and role-based access control.

## Tech Stack

### Backend
- Node.js + JavaScript
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Jest + Supertest for testing

### Frontend
- React (Vite)
- Axios
- React Router
- Tailwind CSS
- React Testing Library + Jest

## Features

- User authentication (register/login) with JWT
- Role-based access control (USER/ADMIN)
- Sweet inventory management (CRUD operations)
- Search and filter functionality
- Purchase and restock operations
- Responsive UI
- Comprehensive test coverage

## Project Structure

```
sweet-shop/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── tests/
│   │   └── app.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── tests/
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## Development

1. Install backend dependencies: `cd backend && npm install`
2. Set up environment variables
3. Start backend: `npm run dev`
4. Install frontend dependencies: `cd frontend && npm install`
5. Start frontend: `npm run dev`

## Testing

- Backend tests: `cd backend && npm test`
- Frontend tests: `cd frontend && npm test`
- Coverage reports: `npm run test:coverage`
