<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class HistoriPenghuni extends Model
{
    protected $table = 'histori_penghuni';

    protected $fillable = [
        'rumah_id',
        'penghuni_id',
        'tanggal_masuk',
        'tanggal_keluar',
    ];

    public function rumah()
    {
        return $this->belongsTo(Rumah::class);
    }

    public function penghuni()
    {
        return $this->belongsTo(Penghuni::class);
    }

    public function scopeAktif(Builder $query)
    {
        return $query->whereNull('tanggal_keluar');
    }
}
