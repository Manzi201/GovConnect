# GovConnect Development Setup Guide

## System Requirements

- **OS:** Windows, macOS, or Linux
- **Node.js:** v16.x or higher
- **npm:** v8.x or higher
- **MongoDB:** v5.x or higher
- **Git:** Latest version

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/govconnect/govconnect.git
cd govconnect
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with:
# - MONGODB_URI
# - JWT_SECRET
# - Twilio credentials
# - Firebase credentials
# - CORS_ORIGIN=http://localhost:3000

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (if needed)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Database Setup

```bash
# If using local MongoDB:
mongod

# If using MongoDB Atlas:
# 1. Create cluster on https://www.mongodb.com/cloud/atlas
# 2. Get connection string
# 3. Update MONGODB_URI in backend/.env
```

### 5. Seed Sample Data (Optional)

```bash
cd backend

# Create a script to seed data
node -e "const { seedDatabase } = require('./utils/seed'); seedDatabase().then(() => process.exit());"
```

## Development Workflow

### Running Both Services

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

### Code Structure

**Backend (`/backend`)**

- `/models` - MongoDB schemas
- `/routes` - API route definitions
- `/controllers` - Business logic
- `/middleware` - Auth, validation
- `/utils` - Helper functions
- `server.js` - Entry point

**Frontend (`/frontend`)**

- `/src/pages` - Page components
- `/src/components` - Reusable components
- `/src/services` - API calls
- `/src/stores` - State management
- `/src/App.js` - Main app

## Available Commands

### Backend

```bash
npm start          # Production mode
npm run dev        # Development mode with nodemon
npm test           # Run tests
npm run lint       # Run ESLint
```

### Frontend

```bash
npm start          # Development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from CRA (not recommended)
```

## Testing

### Backend Testing

```bash
cd backend
npm test

# With coverage
npm test -- --coverage
```

### Frontend Testing

```bash
cd frontend
npm test

# With coverage
npm test -- --coverage
```

## Debugging

### Backend Debugging

```bash
# Chrome DevTools
node --inspect-brk server.js

# Then open chrome://inspect
```

### Frontend Debugging

Use React DevTools browser extension for React debugging.

## Common Issues & Solutions

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Start MongoDB: mongod
2. Or update MONGODB_URI to use MongoDB Atlas
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000

Solution:
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### CORS Errors

```
Solution:
1. Check CORS_ORIGIN in backend/.env
2. Ensure it matches frontend URL
3. Restart backend after changes
```

### Module Not Found

```
Solution:
npm install
# Or clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/govconnect
JWT_SECRET=your_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
FIREBASE_PROJECT_ID=your_firebase_id
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Code Style

### JavaScript/Node.js

- Use ES6+ syntax
- 2 spaces for indentation
- Use const/let, avoid var
- Semicolons required

### React

- Use functional components
- Use hooks instead of classes
- JSX formatting: 2 spaces indent
- Component file names: PascalCase
- Props validation with PropTypes

## Performance Tips

1. **Use React DevTools Profiler** to identify slow components
2. **Enable Gzip compression** in production
3. **Implement code splitting** with React.lazy()
4. **Use MongoDB indexes** for frequently queried fields
5. **Cache API responses** where appropriate
6. **Lazy load images** with loading attributes
7. **Monitor bundle size** with webpack-bundle-analyzer

## Deployment Preparation

### Backend

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set strong JWT_SECRET
4. Enable HTTPS
5. Set up proper logging
6. Configure rate limiting
7. Enable CORS for production URL only

### Frontend

1. Run `npm run build`
2. Configure API_URL for production
3. Update manifest.json
4. Enable gzip compression
5. Set up CDN for static assets
6. Configure service worker
7. Set up error tracking

## Resources

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [REST API Design Best Practices](https://restfulapi.net)

## Getting Help

1. Check the [Documentation](./DOCUMENTATION.md)
2. Review [Database Schema](../database/SCHEMA.md)
3. Check API endpoints in backend routes
4. Review existing code examples
5. Open an issue on GitHub

---

**Last Updated:** January 27, 2024
