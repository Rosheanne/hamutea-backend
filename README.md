# Hamutea Admin Dashboard Backend

This is the backend API for the Hamutea Admin Dashboard, built with Node.js, Express, and MySQL.

## Features

- User authentication and authorization
- User management (CRUD operations)
- Product management (CRUD operations)
- Order management and statistics
- Secure API with JWT authentication
- Role-based access control

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a MySQL database:
   ```
   mysql -u root -p < database.sql
   ```
5. Configure environment variables:
   - Copy `.env` file and update with your database credentials

## Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get order by ID with items (admin only)
- `PUT /api/orders/:id` - Update order status (admin only)
- `GET /api/orders/stats` - Get order statistics (admin only)

## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected routes:

1. Login with admin credentials to get a token
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

## Default Admin Credentials

- Email: admin@hamutea.com
- Password: admin123

## License

This project is proprietary and confidential.