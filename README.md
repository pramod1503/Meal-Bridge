# MealBridge Application

MealBridge is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that connects food donors with those in need. The platform allows users to donate food items, browse available donations, and claim donations they need.

## Features

- User authentication (register, login)
- Create, view, update, and delete food donations
- Browse available donations
- Claim donations
- User dashboard to manage donations and claims
- Responsive design

## Project Structure

The project is organized into two main directories:

### Backend

- **Models**: Database schemas for User and Donation
- **Routes**: API endpoints for authentication and donations
- **Controllers**: Business logic for handling requests
- **Middleware**: Authentication middleware

### Frontend

- **Components**: Reusable UI components
- **Pages**: Main application pages
- **Context**: Application state management
- **Utils**: Utility functions and API calls

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mealbridge
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user (protected)

### Donations

- `GET /api/donations` - Get all donations
- `GET /api/donations/user` - Get user donations (protected)
- `POST /api/donations` - Create a donation (protected)
- `GET /api/donations/:id` - Get donation by ID
- `PUT /api/donations/:id` - Update donation (protected)
- `DELETE /api/donations/:id` - Delete donation (protected)
- `PUT /api/donations/:id/claim` - Claim donation (protected)

## Technologies Used

- **Frontend**: React.js, React Router, Context API, Bootstrap
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Validator.js, Bcrypt.js

## Future Enhancements

- Add search and filter functionality for donations
- Implement notification system
- Add map integration for location-based searches
- Add messaging between donors and recipients
- Add admin dashboard for platform management
