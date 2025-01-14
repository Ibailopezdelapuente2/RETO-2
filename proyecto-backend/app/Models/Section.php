<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = [
        'name','campus_id'
    ];
    public function campus()
    {
        return $this->belongsTo('App\Models\Campus');
    }

    public function machinetypes()
    {
        return $this->hasMany('App\Models\Machinetype');
    }
}
