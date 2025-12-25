<?php

namespace Database\Factories;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Venue>
 */
class VenueFactory extends Factory
{
    protected $model = Venue::class;

    public function definition(): array
    {
        return [
            'venue_name' => $this->faker->company() . ' Hall',
            'address' => $this->faker->address(),
            'capacity' => $this->faker->numberBetween(100, 10000),
        ];
    }
}


