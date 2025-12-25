<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    /**
     * Display a listing of venues
     */
    public function index(Request $request)
    {
        $venues = Venue::orderBy('venue_name', 'asc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $venues,
        ]);
    }

    /**
     * Store a newly created venue
     */
    public function store(Request $request)
    {
        $request->validate([
            'venue_name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'capacity' => 'required|integer|min:1',
        ]);

        $venue = Venue::create([
            'venue_name' => $request->venue_name,
            'address' => $request->address,
            'capacity' => $request->capacity,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Venue created successfully',
            'data' => $venue,
        ], 201);
    }

    /**
     * Display the specified venue
     */
    public function show($id)
    {
        $venue = Venue::find($id);

        if (!$venue) {
            return response()->json([
                'success' => false,
                'message' => 'Venue not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $venue,
        ]);
    }

    /**
     * Update the specified venue
     */
    public function update(Request $request, $id)
    {
        $venue = Venue::find($id);

        if (!$venue) {
            return response()->json([
                'success' => false,
                'message' => 'Venue not found',
            ], 404);
        }

        $request->validate([
            'venue_name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'capacity' => 'required|integer|min:1',
        ]);

        $venue->update($request->only(['venue_name', 'address', 'capacity']));

        return response()->json([
            'success' => true,
            'message' => 'Venue updated successfully',
            'data' => $venue,
        ]);
    }

    /**
     * Remove the specified venue
     */
    public function destroy($id)
    {
        $venue = Venue::find($id);

        if (!$venue) {
            return response()->json([
                'success' => false,
                'message' => 'Venue not found',
            ], 404);
        }

        // Check if venue has events
        if ($venue->events()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete venue with existing events',
            ], 400);
        }

        $venue->delete();

        return response()->json([
            'success' => true,
            'message' => 'Venue deleted successfully',
        ]);
    }
}
