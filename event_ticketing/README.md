# Event Ticketing System

A comprehensive event ticketing platform built with Laravel (backend) and Next.js (frontend).

## Features

- User authentication and registration
- Admin panel for managing events, categories, venues
- Event browsing and ticket purchasing
- Payment processing
- Ticket management
- Dashboard analytics

## Tech Stack

- **Backend**: Laravel 11, PHP 8.2, MySQL
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: Laravel Sanctum
- **Database**: MySQL

## Installation

### Backend Setup

1. Navigate to the project root
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Copy environment file:
   ```bash
   cp .env.example .env
   ```
4. Configure your database in `.env`
5. Generate application key:
   ```bash
   php artisan key:generate
   ```
6. Run migrations:
   ```bash
   php artisan migrate
   ```
7. Seed the database (optional):
   ```bash
   php artisan db:seed
   ```
8. Start the server:
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. Navigate to the UI directory:
   ```bash
   cd UI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

The API endpoints are documented in `API_DOCUMENTATION.md`.

## Testing

Run tests with:
```bash
php artisan test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.