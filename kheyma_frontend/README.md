# Kheyma Frontend

React + Vite frontend application for the Kheyma camping reservation platform.

## Features

- 🏕️ Browse and search campsites across Egypt
- 🔐 User authentication (login/register)
- 📅 Booking and reservation system
- 👤 User profile management
- ⭐ Reviews and ratings
- 🛡️ Admin dashboard
- 📱 Responsive design with dark mode support

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP client
- **Material Symbols** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8081
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # Reusable components (Navbar, Footer)
├── contexts/         # React contexts (AuthContext)
├── pages/            # Page components
├── services/         # API service layer
├── App.jsx           # Main app component with routing
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Available Pages

- `/` - Homepage with featured campsites
- `/campsites` - Campsite listing page with filters
- `/campsites/:id` - Campsite detail page
- `/login` - User login
- `/register` - User registration
- `/booking/:id` - Booking/reservation page
- `/profile` - User profile dashboard
- `/admin` - Admin dashboard (requires admin role)
- `/about` - About page
- `/contact` - Contact page
- `/forgot-password` - Password reset

## API Integration

The frontend integrates with the backend API documented in `kheyma_backend/README.md`. The API service layer is located in `src/services/api.js` and includes:

- Authentication endpoints
- Location/campsite endpoints
- Review endpoints
- Transaction/booking endpoints
- Admin endpoints

## Authentication

The app uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests. The `AuthContext` provides authentication state and methods throughout the app.

## Styling

The app uses Tailwind CSS v4 with a custom theme matching the design specifications:
- Primary color: `#13ec37` (green)
- Dark mode support
- Plus Jakarta Sans font family
- Material Symbols icons

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:8081`)

## Development

The app uses Vite for fast development with HMR (Hot Module Replacement). Changes to components will automatically reload in the browser.

## License

Part of the Kheyma project.
