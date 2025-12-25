<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id('event_id');
            $table->foreignId('admin_id')->constrained('admins', 'admin_id')->cascadeOnUpdate()->restrictOnDelete();
            $table->string('event_name');
            $table->date('event_date');
            $table->foreignId('category_id')->constrained('categories', 'category_id')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('venue_id')->constrained('venues', 'venue_id')->cascadeOnUpdate()->restrictOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
