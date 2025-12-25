<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venue extends Model
{
    use HasFactory;
    protected $table = 'venues';
    protected $primaryKey = 'venue_id';
    
    protected $fillable = [
        'venue_name',
        'address',
        'capacity',
    ];

    public function events()
    {
        return $this->hasMany(Event::class, 'venue_id', 'venue_id');
    }
}


