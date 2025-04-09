<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rumah extends Model
{
    protected $table = 'rumah';

    protected $fillable = ['nomor_rumah', 'status'];

    public function historiPenghuni()
    {
        return $this->hasMany(HistoriPenghuni::class);
    }

    public function penghuniSaatIni()
    {
        return $this->hasOne(HistoriPenghuni::class)
                    ->whereNull('tanggal_keluar')
                    ->with('penghuni');
    }
    
}
