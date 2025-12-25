<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Display a listing of user's payments
     */
    public function index(Request $request)
    {
        $authUser = $request->user();
        if (!($authUser instanceof \App\Models\User)) {
            return response()->json([
                'success' => false,
                'message' => 'Only user accounts can access payments endpoints',
            ], 403);
        }

        $payments = Payment::with(['ticket.event', 'ticket.user'])
            ->whereHas('ticket', function($query) use ($authUser) {
                $query->where('user_id', $authUser->user_id);
            })
            ->orderBy('payment_date', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $payments,
        ]);
    }

    /**
     * Store a newly created payment
     */
    public function store(Request $request)
    {
        $authUser = $request->user();
        if (!($authUser instanceof \App\Models\User)) {
            return response()->json([
                'success' => false,
                'message' => 'Only user accounts can create payments',
            ], 403);
        }

        $request->validate([
            'ticket_id' => 'required|exists:tickets,ticket_id',
            'payment_method' => 'required|string|in:credit-card,debit-card,gcash,paymaya,paypal,credit_card,debit_card,bank_transfer',
            'amount' => 'required|numeric|min:0',
        ]);

        // Verify ticket belongs to the user
        $ticket = Ticket::where('ticket_id', $request->ticket_id)
            ->where('user_id', $authUser->user_id)
            ->first();

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found or does not belong to you',
            ], 404);
        }

        // Check if ticket already has payment
        if ($ticket->payment) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket already has a payment',
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Create payment record
            $payment = Payment::create([
                'ticket_id' => $ticket->ticket_id,
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'payment_date' => now(),
                'status' => 'completed',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment created successfully',
                'data' => $payment->load(['ticket.event', 'ticket.user']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment',
            ], 500);
        }
    }

    /**
     * Display the specified payment
     */
    public function show(Request $request, $id)
    {
        $authUser = $request->user();
        if (!($authUser instanceof \App\Models\User)) {
            return response()->json([
                'success' => false,
                'message' => 'Only user accounts can access payments endpoints',
            ], 403);
        }

        $payment = Payment::with(['ticket.event', 'ticket.user'])
            ->whereHas('ticket', function($query) use ($authUser) {
                $query->where('user_id', $authUser->user_id);
            })
            ->find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $payment,
        ]);
    }

    /**
     * Update the specified payment
     */
    public function update(Request $request, $id)
    {
        $authUser = $request->user();
        if (!($authUser instanceof \App\Models\User)) {
            return response()->json([
                'success' => false,
                'message' => 'Only user accounts can update payments',
            ], 403);
        }

        $payment = Payment::with('ticket')
            ->whereHas('ticket', function($query) use ($authUser) {
                $query->where('user_id', $authUser->user_id);
            })
            ->find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found',
            ], 404);
        }

        $request->validate([
            'status' => 'sometimes|string|in:pending,completed,failed,refunded',
        ]);

        $payment->update($request->only(['status']));

        return response()->json([
            'success' => true,
            'message' => 'Payment updated successfully',
            'data' => $payment->load(['ticket.event', 'ticket.user']),
        ]);
    }
}
