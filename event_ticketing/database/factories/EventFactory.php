<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Event;
use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'admin_id' => \App\Models\Admin::query()->inRandomOrder()->value('admin_id') ?? \App\Models\Admin::factory(),
            'event_name' => $this->faker->catchPhrase(),
            'event_date' => $this->faker->dateTimeBetween('+1 days', '+6 months')->format('Y-m-d'),
            'category_id' => Category::query()->inRandomOrder()->value('category_id') ?? Category::factory(),
            'venue_id' => Venue::query()->inRandomOrder()->value('venue_id') ?? Venue::factory(),
        ];
    }
}


