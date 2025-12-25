<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Event Ticketing System
|--------------------------------------------------------------------------
|
| 10 Secure APIs for Event Ticketing System
| Each API demonstrates CRUD operations with proper security measures
|
*/


// API 1: USER AUTHENTICATION (Public Routes)

Route::prefix('v1/auth')->group(function () {
    Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
});


// API 2: ADMIN AUTHENTICATION (Public Routes)

Route::prefix('v1/admin-auth')->group(function () {
    Route::post('/login', [App\Http\Controllers\AdminAuthController::class, 'login']);
});


// API 3: USER MANAGEMENT (Protected Routes)

Route::middleware('auth:sanctum')->prefix('v1/users')->group(function () {
    Route::get('/profile', [App\Http\Controllers\UserController::class, 'profile']);
    Route::put('/profile', [App\Http\Controllers\UserController::class, 'updateProfile']);
    Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/me', [App\Http\Controllers\AuthController::class, 'me']);
});


// API 4: ADMIN MANAGEMENT (Admin Protected Routes)

Route::middleware(['auth:sanctum', 'admin'])->prefix('v1/admin')->group(function () {
    Route::get('/profile', [App\Http\Controllers\AdminAuthController::class, 'me']);
    Route::post('/logout', [App\Http\Controllers\AdminAuthController::class, 'logout']);
    
    // Admin CRUD operations
    Route::apiResource('admins', App\Http\Controllers\Admin\AdminController::class);
});


// API 5: EVENT MANAGEMENT (Mixed Access)

// Public event viewing
Route::prefix('v1/events')->group(function () {
    Route::get('/', [App\Http\Controllers\EventController::class, 'index']);
    Route::get('/{id}', [App\Http\Controllers\EventController::class, 'show']);
});

// Admin event management
Route::middleware(['auth:sanctum', 'admin'])->prefix('v1/admin/events')->group(function () {
    Route::get('/', [App\Http\Controllers\Admin\EventController::class, 'index']);
    Route::post('/', [App\Http\Controllers\Admin\EventController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\Admin\EventController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\Admin\EventController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\Admin\EventController::class, 'destroy']);
});


// API 6: CATEGORY MANAGEMENT (Mixed Access)

// Public category viewing
Route::prefix('v1/categories')->group(function () {
    Route::get('/', [App\Http\Controllers\CategoryController::class, 'index']);
});

// Admin category management
Route::middleware(['auth:sanctum', 'admin'])->prefix('v1/admin/categories')->group(function () {
    Route::get('/', [App\Http\Controllers\Admin\CategoryController::class, 'index']);
    Route::post('/', [App\Http\Controllers\Admin\CategoryController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\Admin\CategoryController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\Admin\CategoryController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\Admin\CategoryController::class, 'destroy']);
});


// API 7: VENUE MANAGEMENT (Mixed Access)

// Public venue viewing
Route::prefix('v1/venues')->group(function () {
    Route::get('/', [App\Http\Controllers\VenueController::class, 'index']);
});

// Admin venue management
Route::middleware(['auth:sanctum', 'admin'])->prefix('v1/admin/venues')->group(function () {
    Route::get('/', [App\Http\Controllers\Admin\VenueController::class, 'index']);
    Route::post('/', [App\Http\Controllers\Admin\VenueController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\Admin\VenueController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\Admin\VenueController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\Admin\VenueController::class, 'destroy']);
});


// API 8: TICKET MANAGEMENT (Protected Routes)

Route::middleware('auth:sanctum')->prefix('v1/tickets')->group(function () {
    Route::get('/', [App\Http\Controllers\TicketController::class, 'index']);
    Route::post('/', [App\Http\Controllers\TicketController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\TicketController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\TicketController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\TicketController::class, 'destroy']);
});

// Admin ticket management
Route::middleware(['auth:sanctum', 'admin'])->prefix('v1/admin/tickets')->group(function () {
    Route::get('/', [App\Http\Controllers\Admin\TicketController::class, 'index']);
    Route::get('/{id}', [App\Http\Controllers\Admin\TicketController::class, 'show']);
    Route::delete('/{id}', [App\Http\Controllers\Admin\TicketController::class, 'destroy']);
});


// API 9: PAYMENT MANAGEMENT (Protected Routes)

Route::middleware('auth:sanctum')->prefix('v1/payments')->group(function () {
    Route::get('/', [App\Http\Controllers\PaymentController::class, 'index']);
    Route::post('/', [App\Http\Controllers\PaymentController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\PaymentController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\PaymentController::class, 'update']);
});

// Admin payment management
Route::middleware(['auth:sanctum', 'admin'])->prefix('v1/admin/payments')->group(function () {
    Route::get('/', [App\Http\Controllers\Admin\PaymentController::class, 'index']);
    Route::get('/{id}', [App\Http\Controllers\Admin\PaymentController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\Admin\PaymentController::class, 'update']);
});


// API 10: DASHBOARD/ANALYTICS (Admin Only)

Route::middleware(['auth:sanctum', 'admin'])->prefix('v1/admin/dashboard')->group(function () {
    Route::get('/stats', [App\Http\Controllers\Admin\DashboardController::class, 'stats']);
    Route::get('/reports', [App\Http\Controllers\Admin\DashboardController::class, 'reports']);
    Route::get('/analytics', [App\Http\Controllers\Admin\DashboardController::class, 'analytics']);
});
