<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Display a listing of tickets
     */
    public function index(Request $request)
    {
        $query = Ticket::with(['user', 'event.category', 'event.venue', 'payment']);

        // Filter by event if provided
        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        // Filter by user if provided
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by paid status (has payment)
        if ($request->has('has_payment')) {
            if ($request->has_payment) {
                $query->whereHas('payment');
            } else {
                $query->whereDoesntHave('payment');
            }
        }

        // Search by user or event name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function($userQ) use ($search) {
                    $userQ->where('username', 'like', '%' . $search . '%');
                })->orWhereHas('event', function($eventQ) use ($search) {
                    $eventQ->where('event_name', 'like', '%' . $search . '%');
                });
            });
        }

        $tickets = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ]);
    }

    /**
     * Display the specified ticket
     */
    public function show($id)
    {
        $ticket = Ticket::with(['user', 'event.category', 'event.venue', 'payment'])->find($id);

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
        $ticket = Ticket::find($id);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found',
            ], 404);
        }

        // Tickets cannot be updated (immutable after purchase)
        return response()->json([
            'success' => false,
            'message' => 'Tickets cannot be updated after purchase',
        ], 400);
    }

    /**
     * Remove the specified ticket
     */
    public function destroy($id)
    {
        $ticket = Ticket::find($id);

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
