<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;
    protected $table = 'events';
    protected $primaryKey = 'event_id';
    
    protected $fillable = [
        'admin_id',
        'event_name',
        'event_date',
        'event_time',
        'category_id',
        'venue_id',
        'description',
        'base_price',
        'image_url',
        'total_tickets',
    ];

    protected $appends = [
        'available_tickets',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class, 'venue_id', 'venue_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'event_id', 'event_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'admin_id');
    }

    /**
     * Get the number of available tickets
     */
    public function getAvailableTicketsAttribute()
    {
        $soldTickets = $this->tickets()->count();
        return max(0, $this->total_tickets - $soldTickets);
    }
}


