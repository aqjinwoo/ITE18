<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    /**
     * Display a listing of user's tickets
     */
    public function index(Request $request)
    {
        $authUser = $request->user();
        if (!($authUser instanceof User)) {
            return response()->json([
                'success' => false,
                'message' => 'Only user accounts can access tickets endpoints',
            ], 403);
        }

        $tickets = Ticket::with(['event.category', 'event.venue', 'payment'])
            ->where('user_id', $authUser->user_id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ]);
    }

    /**
     * Store a newly purchased ticket
     */
    public function store(Request $request)
    {
        $authUser = $request->user();
        if (!($authUser instanceof User)) {
            return response()->json([
                'success' => false,
                'message' => 'Only user accounts can purchase tickets',
            ], 403);
        }

        $request->validate([
            'event_id' => 'required|exists:events,event_id',
        ]);

        $event = Event::findOrFail($request->event_id);

        // Check if event is still available
        if ($event->event_date < now()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot purchase tickets for past events',
            ], 400);
        }

        // Check if tickets are available
        $soldTickets = $event->tickets()->count();
        $availableTickets = $event->total_tickets - $soldTickets;
        
        if ($availableTickets <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'No tickets available for this event',
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Create ticket
            $ticket = Ticket::create([
                'user_id' => $authUser->user_id,
                'event_id' => $event->event_id,
                'purchase_date' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ticket created successfully',
                'data' => $ticket->load(['event', 'user']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create ticket',
            ], 500);
        }
    }

    /**
     * Display the specified ticket
     */
    public function show(Request $request, $id)
    {
        $authUser = $request->user();
        if (!($authUser instanceof User)) {
            return response()->json([
                'success' => false,
                'message' => 'Only user accounts can access tickets endpoints',
            ], 403);
        }

        $ticket = Ticket::with(['event.category', 'event.venue', 'payment'])
            ->where('user_id', $authUser->user_id)
            ->find($id);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ticket,
        ]);
    }

    /**
     * Update the specified ticket
     */
    public function update(Request $request, $id)
    {
        $authUser = $request->user();
        if (!($authUser instanceof User)) {
            return response()->json([
                'success' => false,
                'message' => 'Only user accounts can access tickets endpoints',
            ], 403);
        }

        $ticket = Ticket::where('user_id', $authUser->user_id)->find($id);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found',
            ], 404);
        }

        // Tickets are generally not updatable after purchase
        return response()->json([
            'success' => false,
            'message' => 'Tickets cannot be updated after purchase',
        ], 400);
    }

    /**
     * Remove the specified ticket
     */
    public function destroy(Request $request, $id)
    {
        $authUser = $request->user();
        if (!($authUser instanceof User)) {
            return response()->json([
                'success' => false,
                'message' => 'Only user accounts can access tickets endpoints',
            ], 403);
        }

        $ticket = Ticket::where('user_id', $authUser->user_id)->find($id);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found',
            ], 404);
        }

        // Check if ticket has payment
        if ($ticket->payment) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete ticket with existing payment',
            ], 400);
        }

        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket deleted successfully',
        ]);
    }
}
