<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['pending', 'paid', 'failed', 'refunded']);

        return [
            'ticket_id' => Ticket::query()->inRandomOrder()->value('ticket_id') ?? Ticket::factory(),
            'amount' => $this->faker->randomFloat(2, 10, 500),
            'payment_date' => $this->faker->dateTimeBetween('-1 months', 'now')->format('Y-m-d H:i:s'),
            'payment_method' => $this->faker->randomElement(['cash', 'card', 'bank', 'ewallet']),
            'status' => $status,
        ];
    }
}


