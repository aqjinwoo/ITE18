<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of events
     */
    public function index(Request $request)
    {
        $query = Event::with(['category', 'venue', 'admin']);

        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by venue if provided
        if ($request->has('venue_id')) {
            $query->where('venue_id', $request->venue_id);
        }

        // Filter by date range if provided
        if ($request->has('start_date')) {
            $query->where('event_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('event_date', '<=', $request->end_date);
        }

        // Search by name if provided
        if ($request->has('search')) {
            $query->where('event_name', 'like', '%' . $request->search . '%');
        }

        // Only show upcoming events by default (include today's events)
        if (!$request->has('include_past')) {
            $query->where('event_date', '>=', now()->startOfDay());
        }

        $events = $query->orderBy('event_date', 'asc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    /**
     * Display the specified event
     */
    public function show($id)
    {
        $event = Event::with(['category', 'venue', 'admin'])->find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $event,
        ]);
    }
}
