<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penghuni extends Model
{
    protected $table = 'penghuni';

    protected $fillable = [
        'nama_lengkap',
        'foto_ktp',
        'status_penghuni',
        'nomor_telepon',
        'sudah_menikah',
    ];

    protected $casts = [
        'sudah_menikah' => 'boolean',
    ];

    public function pembayaran()
    {
        return $this->hasMany(Pembayaran::class);
    }

    public function rumah()
    {
        return $this->hasOne(Rumah::class);
    }
}
