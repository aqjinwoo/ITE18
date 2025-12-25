# 🎫 Event Ticketing System - Complete API Documentation

## 📋 Overview

This document provides complete documentation for all 10 APIs in the Event Ticketing System. Each API demonstrates proper CRUD operations, authentication, authorization, and follows Laravel MVC architecture.

**Base URL:** `http://127.0.0.1:8000/api/v1`

---

## 🔐 **API 1: User Authentication**

### **POST** `/api/v1/auth/register`
**Description:** Register a new user account
**Security:** Public (no authentication required)
**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Success Response (201 Created):**
```json
{
    "message": "User registered successfully",
    "user": {
        "user_id": 31,
        "username": "johndoe",
        "email": "john@example.com",
        "created_at": "2025-10-27T17:37:19.000000Z",
        "updated_at": "2025-10-27T17:37:19.000000Z"
    },
    "token": "1|abc123xyz789..."
}
```

---

### **POST** `/api/v1/auth/login`
**Description:** Login with existing user credentials
**Security:** Public (no authentication required)
**Headers:** `Content-Type: application/json`

**Request Body:**
```json
    {
        "email": "john@example.com",
        "password": "password123"
    }
```

**Success Response (200 OK):**
```json
{
    "message": "Login successful",
    "user": {
        "user_id": 31,
        "username": "johndoe",
        "email": "john@example.com"
    },
    "token": "2|def456uvw012..."
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
    "message": "The provided credentials are incorrect.",
    "errors": {
        "email": ["The provided credentials are incorrect."]
    }
}
```

---

## 🔐 **API 2: Admin Authentication**

### **POST** `/api/v1/admin-auth/login`
**Description:** Login as an administrator
**Security:** Public (no authentication required)
**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "password"
}
```

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Admin login successful",
    "data": {
        "admin": {
            "admin_id": 1,
            "admin_name": "Super Admin",
            "email": "admin@example.com",
            "role": "super_admin",
            "is_active": true
        },
        "token": "3|ghi789rst345..."
    }
}
```

---

## 👤 **API 3: User Management**

### **GET** `/api/v1/users/profile`
**Description:** Get the authenticated user's profile
**Security:** Protected (requires user authentication)
**Headers:** 
- `Authorization: Bearer YOUR_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "user_id": 31,
        "username": "johndoe",
        "email": "john@example.com",
        "created_at": "2025-10-27T17:37:19.000000Z",
        "updated_at": "2025-10-27T17:37:19.000000Z"
    }
}
```

---

### **PUT** `/api/v1/users/profile`
**Description:** Update the authenticated user's profile
**Security:** Protected (requires user authentication)
**Headers:** 
- `Authorization: Bearer YOUR_TOKEN_HERE`
- `Content-Type: application/json`

**Request Body (all fields optional):**
```json
{
    "username": "newusername",
    "email": "newemail@example.com",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "user_id": 31,
        "username": "newusername",
        "email": "newemail@example.com"
    }
}
```

---

### **POST** `/api/v1/users/logout`
**Description:** Logout user (revoke token)
**Security:** Protected (requires user authentication)
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "message": "Logged out successfully"
}
```

---

### **GET** `/api/v1/users/me`
**Description:** Get authenticated user information
**Security:** Protected (requires user authentication)
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "user": {
        "user_id": 31,
        "username": "johndoe",
        "email": "john@example.com"
    }
}
```

---

## 👨‍💼 **API 4: Admin Management**

### **GET** `/api/v1/admin/profile`
**Description:** Get authenticated admin profile
**Security:** Protected (requires admin authentication)
**Headers:** `Authorization: Bearer ADMIN_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "admin_id": 1,
        "admin_name": "Super Admin",
        "email": "admin@example.com",
        "role": "super_admin"
    }
}
```

---

### **POST** `/api/v1/admin/logout`
**Description:** Logout admin (revoke token)
**Security:** Protected (requires admin authentication)
**Headers:** `Authorization: Bearer ADMIN_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Admin logged out successfully"
}
```

---

### **GET** `/api/v1/admin/admins`
**Description:** List all administrators
**Security:** Protected (requires admin authentication)
**Headers:** `Authorization: Bearer ADMIN_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "admin_id": 1,
            "admin_name": "Super Admin",
            "email": "admin@example.com",
            "role": "super_admin"
        }
    ]
}
```

---

### **POST** `/api/v1/admin/admins`
**Description:** Create a new administrator
**Security:** Protected (requires admin authentication)
**Headers:** 
- `Authorization: Bearer ADMIN_TOKEN_HERE`
- `Content-Type: application/json`

**Request Body:**
```json
{
    "admin_name": "New Admin",
    "email": "newadmin@example.com",
    "password": "securepassword",
    "role": "admin",
    "is_active": true
}
```

---

### **GET** `/api/v1/admin/admins/{admin}`
**Description:** Get specific admin details
**Security:** Protected (requires admin authentication)
**Headers:** `Authorization: Bearer ADMIN_TOKEN_HERE`

---

### **PUT** `/api/v1/admin/admins/{admin}`
**Description:** Update admin information
**Security:** Protected (requires admin authentication)
**Headers:** 
- `Authorization: Bearer ADMIN_TOKEN_HERE`
- `Content-Type: application/json`

---

### **DELETE** `/api/v1/admin/admins/{admin}`
**Description:** Delete an admin account
**Security:** Protected (requires admin authentication)
**Headers:** `Authorization: Bearer ADMIN_TOKEN_HERE`

---

## 🎫 **API 5: Event Management**

### **GET** `/api/v1/events`
**Description:** List all public events (upcoming events only by default)
**Security:** Public (no authentication required)
**Query Parameters:** 
- `include_past=true` - Include past events

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [
            {
                "event_id": 1,
                "admin_id": 1,
                "event_name": "Summer Music Festival 2024",
                "event_date": "2024-12-25",
                "category_id": 3,
                "venue_id": 2,
                "created_at": "2025-10-24T12:46:25.000000Z",
                "updated_at": "2025-10-24T12:46:25.000000Z",
                "category": {
                    "category_id": 3,
                    "category_name": "Music"
                },
                "venue": {
                    "venue_id": 2,
                    "venue_name": "City Stadium",
                    "address": "123 Main St",
                    "capacity": 5000
                },
                "admin": {
                    "admin_id": 1,
                    "admin_name": "Super Admin"
                }
            }
        ]
    }
}
```

---

### **GET** `/api/v1/events/`
**Description:** Get details of a specific event
**Security:** Public (no authentication required)

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "event_id": 1,
        "event_name": "Summer Music Festival 2024",
        "event_date": "2024-12-25",
        "category": {...},
        "venue": {...},
        "admin": {...}
    }
}
```

**Error Response (404 Not Found):**
```json
{
    "success": false,
    "message": "Event not found"
}
```

---

### **GET** `/api/v1/admin/events`
**Description:** List all events (admin view)
**Security:** Protected (requires admin authentication)
**Headers:** `Authorization: Bearer ADMIN_TOKEN_HERE`

---

### **POST** `/api/v1/admin/events`
**Description:** Create a new event
**Security:** Protected (requires admin authentication)
**Headers:** 
- `Authorization: Bearer ADMIN_TOKEN_HERE`
- `Content-Type: application/json`

**Request Body:**
```json
{
    "admin_id": 1,
    "event_name": "New Event 2024",
    "event_date": "2024-12-31",
    "category_id": 1,
    "venue_id": 1
}
```

---

### **GET** `/api/v1/admin/events/{event}`
**Description:** Get specific event details (admin view)
**Security:** Protected (requires admin authentication)

---

### **PUT** `/api/v1/admin/events/{event}`
**Description:** Update event information
**Security:** Protected (requires admin authentication)

---

### **DELETE** `/api/v1/admin/events/{event}`
**Description:** Delete an event
**Security:** Protected (requires admin authentication)

---

## 📂 **API 6: Category Management**

### **GET** `/api/v1/categories`
**Description:** List all event categories
**Security:** Public (no authentication required)

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "category_id": 1,
            "category_name": "Music",
            "created_at": "2025-10-24T12:46:25.000000Z",
            "updated_at": "2025-10-24T12:46:25.000000Z"
        },
        {
            "category_id": 2,
            "category_name": "Sports",
            "created_at": "2025-10-24T12:46:25.000000Z",
            "updated_at": "2025-10-24T12:46:25.000000Z"
        }
    ]
}
```

---

### **GET** `/api/v1/admin/categories`
**Description:** List all categories (admin view)
**Security:** Protected (requires admin authentication)

---

### **POST** `/api/v1/admin/categories`
**Description:** Create a new category
**Security:** Protected (requires admin authentication)
**Headers:** 
- `Authorization: Bearer ADMIN_TOKEN_HERE`
- `Content-Type: application/json`

**Request Body:**
```json
{
    "category_name": "Theater"
}
```

---

### **GET** `/api/v1/admin/categories/{category}`
**Description:** Get specific category details
**Security:** Protected (requires admin authentication)

---

### **PUT** `/api/v1/admin/categories/{category}`
**Description:** Update category information
**Security:** Protected (requires admin authentication)

---

### **DELETE** `/api/v1/admin/categories/{category}`
**Description:** Delete a category
**Security:** Protected (requires admin authentication)

---

## 🏢 **API 7: Venue Management**

### **GET** `/api/v1/venues`
**Description:** List all venues
**Security:** Public (no authentication required)

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "venue_id": 1,
            "venue_name": "City Stadium",
            "address": "123 Main Street",
            "capacity": 5000,
            "created_at": "2025-10-24T12:46:25.000000Z",
            "updated_at": "2025-10-24T12:46:25.000000Z"
        }
    ]
}
```

---

### **GET** `/api/v1/admin/venues`
**Description:** List all venues (admin view)
**Security:** Protected (requires admin authentication)

---

### **POST** `/api/v1/admin/venues`
**Description:** Create a new venue
**Security:** Protected (requires admin authentication)
**Headers:** 
- `Authorization: Bearer ADMIN_TOKEN_HERE`
- `Content-Type: application/json`

**Request Body:**
```json
{
    "venue_name": "New Venue",
    "address": "456 Oak Avenue",
    "capacity": 1000
}
```

---

### **GET** `/api/v1/admin/venues/{venue}`
**Description:** Get specific venue details
**Security:** Protected (requires admin authentication)

---

### **PUT** `/api/v1/admin/venues/{venue}`
**Description:** Update venue information
**Security:** Protected (requires admin authentication)

---

### **DELETE** `/api/v1/admin/venues/{venue}`
**Description:** Delete a venue
**Security:** Protected (requires admin authentication)

---

## 🎟️ **API 8: Ticket Management**

### **GET** `/api/v1/tickets`
**Description:** List all tickets for authenticated user
**Security:** Protected (requires user authentication)
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [
            {
                "ticket_id": 1,
                "user_id": 31,
                "event_id": 1,
                "purchase_date": "2025-10-27T17:40:00.000000Z",
                "event": {
                    "event_id": 1,
                    "event_name": "Summer Music Festival 2024",
                    "category": {...},
                    "venue": {...}
                }
            }
        ]
    }
}
```

---

### **POST** `/api/v1/tickets`
**Description:** Purchase a new ticket
**Security:** Protected (requires user authentication)
**Headers:** 
- `Authorization: Bearer YOUR_TOKEN_HERE`
- `Content-Type: application/json`

**Request Body:**
```json
{
    "event_id": 1
}
```

**Success Response (201 Created):**
```jsonieni
{
    "success": true,
    "message": "Ticket created successfully",
    "data": {
        "ticket_id": 1,
        "user_id": 31,
        "event_id": 1,
        "purchase_date": "2025-10-27T17:40:00.000000Z",
        "event": {...},
        "user": {...}
    }
}
```

**Error Response (400 Bad Request):**
```json
{
    "success": false,
    "message": "Cannot purchase tickets for past events"
}
```

---

### **GET** `/api/v1/tickets/{id}`
**Description:** Get details of a specific ticket
**Security:** Protected (requires user authentication)
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "ticket_id": 1,
        "user_id": 31,
        "event_id": 1,
        "event": {...},
        "payment": {...}
    }
}
```

---

### **PUT** `/api/v1/tickets/{id}`
**Description:** Update ticket (generally not allowed)
**Security:** Protected (requires user authentication)

**Error Response (400 Bad Request):**
```json
{
    "success": false,
    "message": "Tickets cannot be updated after purchase"
}
```

---

### **DELETE** `/api/v1/tickets/{id}`
**Description:** Cancel/delete a ticket
**Security:** Protected (requires user authentication)
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Ticket deleted successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
    "success": false,
    "message": "Cannot delete ticket with existing payment"
}
```

---

### **GET** `/api/v1/admin/tickets`
**Description:** List all tickets (admin view)
**Security:** Protected (requires admin authentication)

---

### **POST** `/api/v1/admin/tickets`
**Description:** Create ticket (admin)
**Security:** Protected (requires admin authentication)

---

### **GET** `/api/v1/admin/tickets/{ticket}`
**Description:** Get specific ticket (admin view)
**Security:** Protected (requires admin authentication)

---

### **PUT** `/api/v1/admin/tickets/{ticket}`
**Description:** Update ticket (admin)
**Security:** Protected (requires admin authentication)

---

### **DELETE** `/api/v1/admin/tickets/{ticket}`
**Description:** Delete ticket (admin)
**Security:** Protected (requires admin authentication)

---

## 💳 **API 9: Payment Management**

### **GET** `/api/v1/payments`
**Description:** List all payments for authenticated user
**Security:** Protected (requires user authentication)
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "payment_id": 1,
            "ticket_id": 1,
            "amount": "50.00",
            "payment_date": "2025-10-27T17:41:00.000000Z",
            "payment_method": "credit_card",
            "status": "completed",
            "ticket": {
                "event": {...}
            }
        }
    ]
}
```

---

### **POST** `/api/v1/payments`
**Description:** Process a payment for a ticket
**Security:** Protected (requires user authentication)
**Headers:** 
- `Authorization: Bearer YOUR_TOKEN_HERE`
- `Content-Type: application/json`

**Request Body:**
```json
{
    "ticket_id": 1,
    "payment_method": "credit_card",
    "amount": 50.00
}
```

**Success Response (201 Created):**
```json
{
    "success": true,
    "message": "Payment created successfully",
    "data": {
        "payment_id": 1,
        "ticket_id": 1,
        "amount": "50.00",
        "payment_method": "credit_card",
        "status": "completed",
        "payment_date": "2025-10-27T17:41:00.000000Z"
    }
}
```

**Error Response (404 Not Found):**
```json
{
    "success": false,
    "message": "Ticket not found or does not belong to you"
}
```

---

### **GET** `/api/v1/payments/{id}`
**Description:** Get details of a specific payment
**Security:** Protected (requires user authentication)
**Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

---

### **PUT** `/api/v1/payments/{id}`
**Description:** Update payment status
**Security:** Protected (requires user authentication)
**Headers:** 
- `Authorization: Bearer YOUR_TOKEN_HERE`
- `Content-Type: application/json`

**Request Body:**
```json
{
    "status": "refunded"
}
```

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Payment updated successfully",
    "data": {...}
}
```

---

### **GET** `/api/v1/admin/payments`
**Description:** List all payments (admin view)
**Security:** Protected (requires admin authentication)

---

### **POST** `/api/v1/admin/payments`
**Description:** Create payment (admin)
**Security:** Protected (requires admin authentication)

---

### **GET** `/api/v1/admin/payments/{payment}`
**Description:** Get specific payment (admin view)
**Security:** Protected (requires admin authentication)

---

### **PUT** `/api/v gu1/admin/payments/{payment}`
**Description:** Update payment (admin)
**Security:** Protected (requires admin authentication)

---

### **DELETE** `/api/v1/admin/payments/{payment}`
**Description:** Delete payment (admin)
**Security:** Protected (requires admin authentication)

---

## 📊 **API 10: Dashboard & Analytics**

### **GET** `/api/v1/admin/dashboard/stats`
**Description:** Get dashboard statistics
**Security:** Protected (requires admin authentication)
**Headers:** `Authorization: Bearer ADMIN_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "total_events": 25,
        "total_users": 150,
        "total_tickets": 300,
        "total_revenue": 15000.00,
        "active_events": 10,
        "upcoming_events": 15,
        "past_events": 5
    }
}
```

---

### **GET** `/api/v1/admin/dashboard/reports`
**Description:** Get detailed reports
**Security:** Protected (requires admin authentication)
**Headers:** `Authorization: Bearer ADMIN_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "monthly_revenue": [...],
        "top_events": [...],
        "user_activity": [...]
    }
}
```

---

### **GET** `/api/v1/admin/dashboard/analytics`
**Description:** Get analytics data
**Security:** Protected (requires admin authentication)
**Headers:** `Authorization: Bearer ADMIN_TOKEN_HERE`

**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "analytics": {...}
    }
}
```

---

## 🔒 **Security Features**

### **Authentication & Authorization**
- ✅ Laravel Sanctum for API token authentication
- ✅ Separate admin authentication system
- ✅ Role-based access control (User vs Admin)
- ✅ Middleware protection for sensitive endpoints

### **Input Validation**
- ✅ Request validation for all endpoints
- ✅ SQL injection protection through Eloquent ORM
- ✅ XSS protection through Laravel's built-in escaping
- ✅ Password confirmation required for registration

### **Business Logic Security**
- ✅ Users can only access their own tickets and payments
- ✅ Admins have full CRUD access
- ✅ Proper foreign key relationships
- ✅ Transaction handling for data integrity

---

## 📊 **HTTP Status Codes**

| Status Code | Meaning | When Used |
|------------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Business logic errors |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Server Error | Internal server error |

---

## 🗄️ **Database Structure**

```
USERS ||--o{ TICKETS : purchases
EVENTS ||--o{ TICKETS : includes
TICKETS ||--|| PAYMENTS : has
EVENTS }o--|| VENUES : held_at
EVENTS }o--|| CATEGORIES : belongs_to
ADMINS ||--o{ EVENTS : manages
```

**Tables:**
1. `users` - User accounts
2. `admins` - Admin accounts  
3. `events` - Events created
4. `tickets` - Tickets purchased
5. `payments` - Payment records
6. `categories` - Event categories
7. `venues` - Event venues
8. `personal_access_tokens` - API tokens

---

## 🚀 **Getting Started**

### **1. Install Dependencies:**
```bash
composer install
```

### **2. Setup Environment:**
Copy `.env.example` to `.env` and configure:
```
DB_DATABASE=event_ticketing
DB_USERNAME=root
DB_PASSWORD=
```

### **3. Run Migrations:**
```bash
php artisan migrate:fresh --seed
```

### **4. Start Server:**
```bash
php artisan serve
```

### **5. Test APIs:**
- Base URL: `http://127.0.0.1:8000/api/v1/`
- Use Postman or any API testing tool

---

## 📝 **Testing Examples**

### **User Registration:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","password_confirmation":"password123"}'
```

### **User Login:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **Get Events (Public):**
```bash
curl -X GET http://127.0.0.1:8000/api/v1/events
```

### **Get User Profile (Protected):**
```bash
curl -X GET http://127.0.0.1:8000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📚 **Summary of All 10 APIs**

| API # | Name | Main Endpoints | Security Level |
|-------|------|---------------|----------------|
| 1 | User Authentication | `/auth/register`, `/auth/login` | Public |
| 2 | Admin Authentication | `/admin-auth/login` | Public |
| 3 | User Management | `/users/profile`, `/users/me` | Protected |
| 4 | Admin Management | `/admin/admins/*` | Admin Only |
| 5 | Event Management | `/events/*` (public), `/admin/events/*` | Mixed |
| 6 | Category Management | `/categories` (public), `/admin/categories/*` | Mixed |
| 7 | Venue Management | `/venues` (public), `/admin/venues/*` | Mixed |
| 8 | Ticket Management | `/tickets/*` (protected), `/admin/tickets/*` | Protected |
| 9 | Payment Management | `/payments/*` (protected), `/admin/payments/*` | Protected |
| 10 | Dashboard & Analytics | `/admin/dashboard/*` | Admin Only |

---

**This API system demonstrates proper Laravel MVC architecture, comprehensive security measures, and follows best practices for API development.** ✅
