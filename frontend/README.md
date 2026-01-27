# GovConnect Frontend

React.js based user interface for the GovConnect public service platform.

## Features

- **User Authentication** - Secure login/registration with JWT
- **Complaint Submission** - Easy-to-use form for submitting complaints
- **Complaint Tracking** - Real-time status updates on submitted complaints
- **Citizen Feedback** - Rate and comment on resolved complaints
- **Analytics Dashboard** - Performance metrics for officials
- **Responsive Design** - Mobile-friendly interface
- **Real-time Notifications** - Live updates via WebSockets

## Getting Started

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Running Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── pages/          # Page components (Home, Login, Complaints, etc.)
├── components/     # Reusable components (Nav, Footer, etc.)
├── services/       # API service calls
├── stores/         # State management
└── App.js          # Main app component
```

## Key Pages

- **HomePage** - Landing page with features overview
- **LoginPage** - User authentication
- **RegisterPage** - New user registration
- **SubmitComplaintPage** - Submit new complaint
- **ComplaintsListPage** - View all complaints with filters
- **ComplaintDetailsPage** - View complaint details and submit feedback
- **AnalyticsDashboard** - Performance metrics (admin/official only)
- **ProfilePage** - User profile information

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Technologies Used

- React 18.2.0
- React Router DOM
- Axios for API calls
- Material-UI for components
- Recharts for visualizations
- Socket.io-client for real-time updates

## API Integration

All API calls are handled through the `services/api.js` module which provides:

- Authentication endpoints
- Complaint management
- Analytics data
- Notifications

## Styling

The project uses CSS modules for component styling with a consistent color scheme:

- Primary: #1e3a5f (Dark Blue)
- Secondary: #ff6b6b (Red)
- Success: #4caf50 (Green)
- Warning: #ff9800 (Orange)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React.lazy()
- Image optimization
- CSS minification in production build
- Lazy loading for routes

## Security

- JWT token management
- Secure API communication
- Input validation
- XSS prevention

## Contributing

1. Create a feature branch
2. Make changes following code standards
3. Submit a pull request with description

---

**Version:** 1.0.0
