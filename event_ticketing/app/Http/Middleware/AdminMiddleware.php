<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please login first.',
            ], 401);
        }

        // Check if user is an admin - check the class name instead of instanceof
        if (!$user instanceof \App\Models\Admin) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin privileges required. Your account type: ' . get_class($user),
            ], 403);
        }

        // Check if admin is active
        if (isset($user->is_active) && !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Admin account is inactive.',
            ], 403);
        }

        return $next($request);
    }
}
