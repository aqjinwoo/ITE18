<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\Payment;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Venue;
use App\Models\Admin;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create categories with proper icons
        $this->seedCategories();
        
        // Create Philippine venues
        $this->seedPhilippineVenues();
        
        // Create admins (first admin for you to use)
        Admin::create([
            'admin_name' => 'Admin User',
            'email' => 'admin@ticketing.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create a test user
        User::create([
            'username' => 'testuser',
            'email' => 'user@ticketing.com',
            'password' => bcrypt('password'),
        ]);

        // NO EVENTS - You will add them manually!
        // Events table is empty and ready for your manual entries
    }

    /**
     * Seed categories with icons and descriptions
     */
    private function seedCategories(): void
    {
        $categories = [
            ['category_name' => 'Music', 'icon' => 'music', 'description' => 'Concerts, festivals, and live performances'],
            ['category_name' => 'Conference', 'icon' => 'briefcase', 'description' => 'Professional gatherings and business summits'],
            ['category_name' => 'Workshop', 'icon' => 'cpu', 'description' => 'Educational sessions and hands-on training'],
            ['category_name' => 'Festival', 'icon' => 'palette', 'description' => 'Cultural celebrations and community events'],
            ['category_name' => 'Theater', 'icon' => 'film', 'description' => 'Plays, musicals, and theatrical performances'],
            ['category_name' => 'Sports', 'icon' => 'trophy', 'description' => 'Athletic events and competitions'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }

    /**
     * Seed Philippine venues
     */
    private function seedPhilippineVenues(): void
    {
        $venues = [
            // Metro Manila
            ['venue_name' => 'Mall of Asia Arena', 'address' => 'SM Mall of Asia Complex, Bay City, Pasay, Metro Manila, Philippines', 'capacity' => 20000],
            ['venue_name' => 'Araneta Coliseum', 'address' => 'Araneta City, Cubao, Quezon City, Metro Manila, Philippines', 'capacity' => 16500],
            ['venue_name' => 'Philippine International Convention Center', 'address' => 'CCP Complex, Roxas Boulevard, Pasay, Metro Manila, Philippines', 'capacity' => 10000],
            ['venue_name' => 'Samsung Hall', 'address' => 'SM Aura Premier, McKinley Parkway, Taguig, Metro Manila, Philippines', 'capacity' => 1500],
            ['venue_name' => 'Circuit Makati Events Ground', 'address' => 'Circuit Lane, AP Reyes Street, Makati, Metro Manila, Philippines', 'capacity' => 5000],
            ['venue_name' => 'Newport Performing Arts Theater', 'address' => 'Resorts World Manila, Newport City, Pasay, Metro Manila, Philippines', 'capacity' => 1500],
            
            // Cebu
            ['venue_name' => 'SM Seaside City Cebu', 'address' => 'South Road Properties, Cebu City, Cebu, Philippines', 'capacity' => 5000],
            ['venue_name' => 'Waterfront Cebu City Hotel', 'address' => 'Salinas Drive, Lahug, Cebu City, Cebu, Philippines', 'capacity' => 3000],
            
            // Davao
            ['venue_name' => 'SMX Convention Center Davao', 'address' => 'SM Lanang Premier, Davao City, Davao del Sur, Philippines', 'capacity' => 4000],
            ['venue_name' => 'Abreeza Mall Activity Center', 'address' => 'J.P. Laurel Avenue, Davao City, Davao del Sur, Philippines', 'capacity' => 2000],
            
            // Baguio
            ['venue_name' => 'Baguio Convention Center', 'address' => 'Governor Pack Road, Baguio City, Benguet, Philippines', 'capacity' => 2500],
            ['venue_name' => 'CAP Development Center', 'address' => 'Camp John Hay, Baguio City, Benguet, Philippines', 'capacity' => 1500],
            
            // Other major cities
            ['venue_name' => 'Iloilo Convention Center', 'address' => 'Megaworld Business Park, Iloilo City, Iloilo, Philippines', 'capacity' => 3500],
            ['venue_name' => 'Limketkai Center', 'address' => 'Rosario Arcade, Lapasan, Cagayan de Oro, Misamis Oriental, Philippines', 'capacity' => 3000],
        ];

        foreach ($venues as $venue) {
            Venue::create($venue);
        }
    }
}
