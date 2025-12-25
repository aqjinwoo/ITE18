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
        Schema::table('events', function (Blueprint $table) {
            // Add missing columns if they don't exist
            if (!Schema::hasColumn('events', 'description')) {
                $table->text('description')->nullable()->after('event_date');
            }
            if (!Schema::hasColumn('events', 'base_price')) {
                $table->decimal('base_price', 10, 2)->default(0)->after('description');
            }
            if (!Schema::hasColumn('events', 'image_url')) {
                $table->string('image_url')->nullable()->after('base_price');
            }
            if (!Schema::hasColumn('events', 'total_tickets')) {
                $table->integer('total_tickets')->default(100)->after('image_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'description')) {
                $table->dropColumn('description');
            }
            if (Schema::hasColumn('events', 'base_price')) {
                $table->dropColumn('base_price');
            }
            if (Schema::hasColumn('events', 'image_url')) {
                $table->dropColumn('image_url');
            }
            if (Schema::hasColumn('events', 'total_tickets')) {
                $table->dropColumn('total_tickets');
            }
        });
    }
};
