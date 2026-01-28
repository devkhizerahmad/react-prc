# Complete User Registration System

An industry-level user registration and authentication system built with Node.js, Express, Prisma, and PostgreSQL.

## Features

- ✅ **User Registration** with comprehensive input validation
- ✅ **User Login** with secure authentication
- ✅ **Password Hashing** using bcryptjs
- ✅ **JWT Token Authentication**
- ✅ **Protected Routes** with middleware
- ✅ **Input Validation** using Joi middleware
- ✅ **Comprehensive Error Handling**
- ✅ **Security Middleware** (Helmet, Rate Limiting)
- ✅ **API Endpoints** for all required operations

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables in `.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
DATABASE_URL="your-postgresql-connection-string"
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Push database schema:

```bash
npx prisma db push
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Public Endpoints

#### 1. Health Check

```
GET /api/health
```

Response:

```json
{
  "status": "✅ Backend OK"
}
```

#### 2. User Registration

```
POST /api/signup
```

Request Body:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

#### 3. User Login

```
POST /api/login
```

Request Body:

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

#### 4. Get User by ID

```
GET /api/users/:id
```

Response:

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### 5. Get User by Email

```
GET /api/users/email/:email
```

Response:

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Protected Endpoints (Require Authentication)

#### 6. Get All Users

```
GET /api/users
```

Headers:

```
Authorization: Bearer <jwt-token>
```

Response:

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### 7. Get Current User Profile

```
GET /api/profile
```

Headers:

```
Authorization: Bearer <jwt-token>
```

Response:

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Validation Rules

### Signup Validation

- **Name**: 2-50 characters, required
- **Email**: Valid email format, required, unique
- **Password**: Minimum 8 characters with:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (!@#$%^&\*)

### Login Validation

- **Email**: Valid email format, required
- **Password**: Required

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["array of validation errors (if applicable)"]
}
```

Common HTTP Status Codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (token expired or invalid)
- `404`: Not Found
- `409`: Conflict (user already exists)
- `429`: Too Many Requests (rate limiting)
- `500`: Internal Server Error

## Security Features

- **Password Hashing**: bcryptjs with 12 salt rounds
- **JWT Tokens**: Secure token generation with expiration
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers
- **CORS**: Configured for frontend integration
- **Input Validation**: Comprehensive Joi validation
- **Error Sanitization**: Development vs Production error messages

## Testing

Run the demo script to test all functionality:

```bash
node demo.js
```

This will:

1. Check API health
2. Register test users
3. Login users
4. Test protected routes
5. Test public lookup endpoints
6. Test error handling

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── userController.js      # User business logic
│   ├── middleware/
│   │   ├── auth.js               # Authentication middleware
│   │   └── validation.js         # Input validation middleware
│   ├── routes/
│   │   ├── index.js              # Main routes
│   │   └── userRoutes.js         # User-specific routes
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server entry point
├── prisma/
│   └── schema.prisma             # Database schema
├── .env                          # Environment variables
├── demo.js                       # Demo/test script
└── package.json                  # Dependencies
```

## Dependencies

- **express**: Web framework
- **prisma**: ORM
- **@prisma/client**: Prisma client
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **joi**: Input validation
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

## Environment Variables

| Variable     | Description                          | Required |
| ------------ | ------------------------------------ | -------- |
| PORT         | Server port                          | Yes      |
| NODE_ENV     | Environment (development/production) | Yes      |
| JWT_SECRET   | Secret key for JWT signing           | Yes      |
| DATABASE_URL | PostgreSQL connection string         | Yes      |

## Best Practices Implemented

1. **Separation of Concerns**: Controllers, middleware, and routes are separated
2. **Input Validation**: All inputs are validated before processing
3. **Error Handling**: Comprehensive error handling with appropriate HTTP codes
4. **Security**: Password hashing, JWT authentication, rate limiting
5. **Data Sanitization**: Passwords never returned in responses
6. **Logging**: Request logging in development mode
7. **Environment Configuration**: Proper environment variable usage
8. **Database Relationships**: Proper schema design
9. **API Documentation**: Clear endpoint documentation
10. **Testing**: Demo script for easy testing

This system is production-ready and follows industry best practices for security, scalability, and maintainability.
