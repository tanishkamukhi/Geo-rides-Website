# Geo Rides Backend Setup Guide

This guide explains how to set up the PHP backend for Geo Rides database and API operations.

## Prerequisites

- PHP 7.4+
- MySQL/MariaDB
- Apache/Nginx web server
- Composer (optional, for dependency management)

## Setup Steps

### 1. Database Setup

1. Open your MySQL client (phpMyAdmin, MySQL Workbench, or command line)
2. Execute the SQL schema from `server/database/schema.sql`:

```sql
-- Copy all contents from server/database/schema.sql and execute
```

Or via command line:
```bash
mysql -u root -p < server/database/schema.sql
```

This will create:
- `geo_rides` database
- `users` table (customer accounts)
- `drivers` table (driver accounts)
- `bookings` table (ride bookings)
- `payments` table (payment records)
- `reviews` table (ratings and reviews)
- `wallets` table (user wallets)
- `student_discounts` table (student special plans)

### 2. Configure Database Connection

Update the database credentials in the PHP files:

**File:** `server/api/register.php`, `server/api/login.php`, `server/api/book-ride.php`

```php
$host = 'localhost';
$db = 'geo_rides';
$user = 'root';
$password = ''; // Change if you have a password
```

### 3. API Endpoints

The following endpoints are available:

#### Register User
- **URL:** `/api/register.php`
- **Method:** POST
- **Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "password": "password123",
  "confirmPassword": "password123"
}
```
- **Response:**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

#### Login User
- **URL:** `/api/login.php`
- **Method:** POST
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "token": "abc123xyz...",
  "userId": 1
}
```

#### Book a Ride
- **URL:** `/api/book-ride.php`
- **Method:** POST
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
{
  "pickupLocation": "123 Main St, Delhi",
  "dropLocation": "456 Park Ave, Delhi",
  "vehicleType": "cab"
}
```
- **Response:**
```json
{
  "message": "Ride booked successfully",
  "bookingId": "GEO123ABC",
  "estimatedFare": "₹250",
  "estimatedTime": "5 mins"
}
```

### 4. Connect Frontend to Backend

Update the API URLs in your React components:

**Example in `client/pages/Login.tsx`:**
```javascript
const response = await fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

Replace `/api/login` with your actual backend URL:
- Local development: `http://localhost:8000/api/login.php`
- Production: `https://yourdomain.com/api/login.php`

### 5. File Structure

```
server/
├── api/
│   ├── register.php       # User registration endpoint
│   ├── login.php          # User login endpoint
│   └── book-ride.php      # Ride booking endpoint
└── database/
    └── schema.sql         # Database schema

```

### 6. Security Considerations

⚠️ **Important:** The current PHP files are basic implementations. For production, implement:

1. **Input Validation:** More strict validation and sanitization
2. **SQL Injection Prevention:** Use prepared statements (already implemented)
3. **CORS Protection:** Configure properly for your domain
4. **HTTPS:** Always use HTTPS in production
5. **Password Hashing:** Using bcrypt (already implemented)
6. **Rate Limiting:** Prevent brute force attacks
7. **JWT Tokens:** Implement proper JWT instead of simple tokens
8. **Environment Variables:** Store credentials in .env file

### 7. Testing the Backend

Use Postman or cURL to test endpoints:

```bash
# Register
curl -X POST http://localhost:8000/api/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/login.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 8. Sample Test Data

Drivers are pre-populated in the database:
- **Ramesh Kumar** - Cab driver, Rating 4.9
- **Priya Singh** - Bike taxi, Rating 4.8
- **Aditya Patel** - Auto driver, Rating 4.7

### 9. Common Issues

**Issue:** "Database connection failed"
- Solution: Check database credentials and ensure MySQL is running

**Issue:** "Table doesn't exist"
- Solution: Execute the schema.sql file again

**Issue:** CORS errors
- Solution: Ensure PHP headers allow your frontend domain

**Issue:** Passwords not matching
- Solution: Ensure both password fields match before submitting

### 10. Production Deployment

For production deployment:

1. Use a proper authentication system (OAuth2, JWT)
2. Set up HTTPS with SSL certificate
3. Use environment variables for sensitive data
4. Implement rate limiting
5. Set up database backups
6. Use a CDN for static assets
7. Implement proper error logging
8. Set up monitoring and alerts

## Next Steps

1. Update API endpoints in your React components to match your backend URL
2. Test the registration and login flows
3. Test the booking endpoint
4. Implement payment processing (Stripe, Razorpay, etc.)
5. Add email notifications
6. Implement real-time location tracking
7. Add push notifications

For questions or issues, refer to the inline comments in the PHP files.
