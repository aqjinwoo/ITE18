<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        return [
            'user_id' => User::query()->inRandomOrder()->value('user_id') ?? User::factory(),
            'event_id' => Event::query()->inRandomOrder()->value('event_id') ?? Event::factory(),
            'purchase_date' => $this->faker->dateTimeBetween('-1 months', 'now')->format('Y-m-d H:i:s'),
        ];
    }
}


