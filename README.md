Event Ticketing System
A comprehensive event ticketing platform built with Laravel (backend) and Next.js (frontend).

Features
User authentication and registration
Admin panel for managing events, categories, venues
Event browsing and ticket purchasing
Payment processing
Ticket management
Dashboard analytics
Tech Stack
Backend: Laravel 11, PHP 8.2, MySQL
Frontend: Next.js 14, React, TypeScript, Tailwind CSS
Authentication: Laravel Sanctum
Database: MySQL
Installation
Backend Setup
Navigate to the project root
Install PHP dependencies:
composer install
Copy environment file:
cp .env.example .env
Configure your database in .env
Generate application key:
php artisan key:generate
Run migrations:
php artisan migrate
Seed the database (optional):
php artisan db:seed
Start the server:
php artisan serve
Frontend Setup
Navigate to the UI directory:
cd UI
Install dependencies:
npm install
Start the development server:
npm run dev
API Documentation
The API endpoints are documented in API_DOCUMENTATION.md.

Testing
Run tests with:

php artisan test
Contributing
Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Create a Pull Request
