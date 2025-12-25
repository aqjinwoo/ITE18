<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Category;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

        // Search by name if provided
        if ($request->has('search')) {
            $query->where('event_name', 'like', '%' . $request->search . '%');
        }

        $events = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    /**
     * Store a newly created event
     */
    public function store(Request $request)
    {
        // Log incoming request for debugging
        Log::info('Event creation request received', [
            'all_data' => $request->all(),
            'has_file' => $request->hasFile('image'),
            'user' => $request->user() ? $request->user()->admin_id : 'no user',
        ]);

        $request->validate([
            'event_name' => 'required|string|max:255',
            'event_date' => 'required|date',
            'event_time' => 'nullable|date_format:H:i',
            'category_id' => 'required|exists:categories,category_id',
            'venue_id' => 'required|exists:venues,venue_id',
            'description' => 'nullable|string',
            'base_price' => 'nullable|numeric|min:0',
            'total_tickets' => 'nullable|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'image_url' => 'nullable|url',
        ]);

        // Handle image upload
        $imageUrl = $request->image_url; // Use provided URL if no file uploaded
        
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/events'), $filename);
            $imageUrl = '/uploads/events/' . $filename;
        }

        // If no image provided, use a category-based default
        if (!$imageUrl) {
            $imageUrl = $this->getDefaultImageForCategory($request->category_id);
        }

        $event = Event::create([
            'event_name' => $request->event_name,
            'event_date' => $request->event_date,
            'event_time' => $request->event_time ?? '00:00',
            'category_id' => $request->category_id,
            'venue_id' => $request->venue_id,
            'admin_id' => $request->user()->admin_id,
            'description' => $request->description,
            'base_price' => $request->base_price ?? 0,
            'total_tickets' => $request->total_tickets ?? 100,
            'image_url' => $imageUrl,
        ]);

        Log::info('Event created successfully', ['event_id' => $event->event_id, 'event_name' => $event->event_name]);

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data' => $event->load(['category', 'venue', 'admin']),
        ], 201);
    }

    /**
     * Get default image URL based on category
     */
    private function getDefaultImageForCategory($categoryId): string
    {
        $categoryImages = [
            'Music' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
            'Conference' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
            'Workshop' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
            'Festival' => 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
            'Theater' => 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
            'Sports' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
        ];

        $category = \App\Models\Category::find($categoryId);
        return $categoryImages[$category->category_name ?? 'Music'] ?? $categoryImages['Music'];
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

    /**
     * Update the specified event
     */
    public function update(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found',
            ], 404);
        }

        $request->validate([
            'event_name' => 'sometimes|string|max:255',
            'event_date' => 'sometimes|date',
            'event_time' => 'nullable|date_format:H:i',
            'category_id' => 'sometimes|exists:categories,category_id',
            'venue_id' => 'sometimes|exists:venues,venue_id',
            'description' => 'nullable|string',
            'base_price' => 'nullable|numeric|min:0',
            'total_tickets' => 'nullable|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'image_url' => 'nullable|url',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old uploaded image if exists
            if ($event->image_url && str_starts_with($event->image_url, '/uploads/')) {
                $oldPath = public_path($event->image_url);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }
            
            $image = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/events'), $filename);
            $event->image_url = '/uploads/events/' . $filename;
        } elseif ($request->has('image_url')) {
            $event->image_url = $request->image_url;
        }

        $event->update($request->only([
            'event_name', 'event_date', 'event_time', 'category_id', 'venue_id',
            'description', 'base_price', 'total_tickets'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'data' => $event->load(['category', 'venue', 'admin']),
        ]);
    }

    /**
     * Remove the specified event
     */
    public function destroy($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found',
            ], 404);
        }

        // Check if event has tickets
        if ($event->tickets()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete event with existing tickets',
            ], 400);
        }

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully',
        ]);
    }
}
