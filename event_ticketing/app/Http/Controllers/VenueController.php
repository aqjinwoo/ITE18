<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    /**
     * Display a listing of venues
     */
    public function index(Request $request)
    {
        $venues = Venue::orderBy('venue_name', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $venues,
        ]);
    }
}
