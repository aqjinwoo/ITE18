<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $categories = [
            ['name' => 'Music', 'icon' => 'music', 'desc' => 'Concerts, festivals, and live performances'],
            ['name' => 'Sports', 'icon' => 'trophy', 'desc' => 'Athletic events and competitions'],
            ['name' => 'Theater', 'icon' => 'film', 'desc' => 'Plays, musicals, and theatrical performances'],
            ['name' => 'Conference', 'icon' => 'briefcase', 'desc' => 'Professional gatherings and seminars'],
            ['name' => 'Workshop', 'icon' => 'cpu', 'desc' => 'Educational sessions and training events'],
            ['name' => 'Festival', 'icon' => 'palette', 'desc' => 'Cultural celebrations and community events'],
        ];
        
        $category = $this->faker->unique()->randomElement($categories);
        
        return [
            'category_name' => $category['name'],
            'icon' => $category['icon'],
            'description' => $category['desc'],
        ];
    }
}


