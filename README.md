# E-commerce API with Discount Code System

A Node.js-based e-commerce API that implements cart management and a unique discount code system where every nth order generates a 10% discount coupon.

## Features

- User Authentication (Register/Login)
- Order Management
- Automated Discount Code Generation (every 5th order)
- Discount Code Validation
- Admin Dashboard Statistics

## Tech Stack

- Node.js
- Express.js
- JWT for Authentication
- Jest & Supertest for Testing
- In-memory Database Implementation

## API Endpoints

### Authentication
```http
POST /register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

```http
POST /login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}

## Project Structure

├── config/
│ └── db.js # In-memory database implementation
├── controllers/
│ ├── auth.js # Authentication controller
│ └── orders.js # Order management controller
├── routes/
│ └── index.js # API routes
├── tests/
│ └── main.test.js # Test cases
├── app.js # Express app setup
└── package.json
```

## API Documentation

### 1. Authentication APIs

#### Register User
```http
POST /register
Content-Type: application/json

Request:
{
    "email": "user@example.com",
    "password": "password123"
}

Response Success (200):
{
    "message": "User registered successfully",
    "success": true
}

Response Error (400):
{
    "message": "User already exists",
    "success": false
}
```

#### Login User
```http
POST /login
Content-Type: application/json

Request:
{
    "email": "user@example.com",
    "password": "password123"
}

Response Success (200):
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "success": true
}

Response Error (400):
{
    "message": "Invalid username or password",
    "success": false
}
```

### 2. Order Management APIs

#### Create Order (Calculate Total with Discount)
```http
POST /orders
Authorization: Bearer {jwt_token}
Content-Type: application/json

Request:
{
    "order": [
        {
            "price": 100,
            "quantity": 2
        },
        {
            "price": 50,
            "quantity": 1
        }
    ],
    "discountCode": "ABC123XYZ" // optional
}

Response Success (200):
{
    "message": "Discount code applied successfully",
    "totalAmountWithDiscount": 225,
    "discountAmount": 25,
    "success": true
}

Response Without Discount (400):
{
    "message": "Invalid discount code",
    "totalAmount": 250,
    "success": false
}
```

#### Place Final Order
```http
POST /place-order
Authorization: Bearer {jwt_token}
Content-Type: application/json

Request:
{
    "order": [
        {
            "price": 100,
            "quantity": 2
        },
        {
            "price": 50,
            "quantity": 1
        }
    ],
    "discountCode": "ABC123XYZ",
    "finalAmount": 225,
    "discountAmount": 25
}

Response Success (200):
{
    "message": "Order created successfully",
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "success": true
}
```

### 3. Admin APIs

#### Get Discount Code
```http
GET /admin/discount-code
Authorization: Bearer {jwt_token}

Response Success (200):
{
    "message": "Discount code generated successfully",
    "discountCode": "ABC123XYZ",
    "success": true
}

Response Error (400):
{
    "message": "Discount code not generated",
    "success": false
}
```

#### Get Total Orders
```http
GET /admin/orders
Authorization: Bearer {jwt_token}

Response Success (200):
{
    "message": "Total orders",
    "totalOrders": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "userId": "123",
            "order": [
                {
                    "price": 100,
                    "quantity": 2
                }
            ],
            "finalAmount": 180,
            "discountAmount": 20
        }
    ],
    "success": true
}
```

## Sample Usage Flow

1. **Register a New User**
```bash
curl -X POST http://localhost:3000/register \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com", "password": "password123"}'
```

2. **Login to Get JWT Token**
```bash
curl -X POST http://localhost:3000/login \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com", "password": "password123"}'
```

3. **Create Order with Discount Code**
```bash
curl -X POST http://localhost:3000/orders \
-H "Authorization: Bearer {jwt_token}" \
-H "Content-Type: application/json" \
-d '{
    "order": [
        {"price": 100, "quantity": 2},
        {"price": 50, "quantity": 1}
    ],
    "discountCode": "ABC123XYZ"
}'
```

4. **Place Final Order**
```bash
curl -X POST http://localhost:3000/place-order \
-H "Authorization: Bearer {jwt_token}" \
-H "Content-Type: application/json" \
-d '{
    "order": [
        {"price": 100, "quantity": 2},
        {"price": 50, "quantity": 1}
    ],
    "discountCode": "ABC123XYZ",
    "finalAmount": 225,
    "discountAmount": 25
}'
```

5. **Check Order History (Admin)**
```bash
curl -X GET http://localhost:3000/admin/orders \
-H "Authorization: Bearer {jwt_token}"
```

## Important Notes

1. **Authentication**
   - All endpoints except `/register` and `/login` require JWT token
   - Token format: `Bearer {jwt_token}`
   - Token expires in 7 days

2. **Discount Codes**
   - Generated automatically for every 2nd order
   - Can be changed in orders.js file
   - Fixed 10% discount
   - One-time use only
   - User-specific
   - Cannot be reused once applied

3. **Error Handling**
   - All endpoints return `success` boolean
   - Error messages are descriptive
   - Invalid tokens return 401 Unauthorized
   - Bad requests return 400
   - Successful operations return 200
