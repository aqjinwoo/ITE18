<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Event Ticketing System
|--------------------------------------------------------------------------
|
| This application uses Next.js for all UI rendering.
| Laravel serves strictly as a REST API.
| 
| All application routes are defined in routes/api.php.
| This file only contains essential non-UI routes.
|
*/

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Event Ticketing API is running',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Redirect root to API documentation or info
Route::get('/', function () {
    return response()->json([
        'message' => 'Event Ticketing API',
        'version' => '1.0',
        'documentation' => '/api/v1',
        'frontend' => 'http://localhost:3000',
    ]);
});

// Catch-all for undefined web routes - redirect to API
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Route not found. This is an API-only backend. Please use the Next.js frontend at http://localhost:3000',
    ], 404);
});
