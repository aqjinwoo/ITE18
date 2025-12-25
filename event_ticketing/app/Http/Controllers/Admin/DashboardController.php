<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Payment;
use App\Models\Category;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(Request $request)
    {
        $stats = [
            'total_events' => Event::count(),
            'total_users' => User::count(),
            'total_tickets' => Ticket::count(),
            'total_payments' => Payment::count(),
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'active_events' => Event::where('event_date', '>=', now())->count(),
            'upcoming_events' => Event::where('event_date', '>=', now())
                ->where('event_date', '<=', now()->addDays(30))
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get detailed reports
     */
    public function reports(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30));
        $dateTo = $request->get('date_to', now());

        $reports = [
            'events_by_category' => Category::withCount('events')->get(),
            'events_by_venue' => Venue::withCount('events')->get(),
            'revenue_by_month' => Payment::select(
                DB::raw('DATE_FORMAT(payment_date, "%Y-%m") as month'),
                DB::raw('SUM(amount) as total_revenue')
            )
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$dateFrom, $dateTo])
            ->groupBy('month')
            ->orderBy('month')
            ->get(),
            'ticket_sales_trend' => Ticket::select(
                DB::raw('DATE(purchase_date) as date'),
                DB::raw('COUNT(*) as tickets_sold')
            )
            ->whereBetween('purchase_date', [$dateFrom, $dateTo])
            ->groupBy('date')
            ->orderBy('date')
            ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $reports,
        ]);
    }

    /**
     * Get analytics data
     */
    public function analytics(Request $request)
    {
        $analytics = [
            'top_events' => Event::withCount('tickets')
                ->orderBy('tickets_count', 'desc')
                ->limit(10)
                ->get(),
            'top_venues' => Venue::withCount('events')
                ->orderBy('events_count', 'desc')
                ->limit(10)
                ->get(),
            'user_registration_trend' => User::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as new_users')
            )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get(),
            'payment_methods' => Payment::select('payment_method')
                ->selectRaw('COUNT(*) as count')
                ->selectRaw('SUM(amount) as total_amount')
                ->where('status', 'completed')
                ->groupBy('payment_method')
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $analytics,
        ]);
    }
}
