<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Pembayaran extends Model
{
    protected $table = 'pembayaran';

    protected $fillable = [
        'penghuni_id',
        'rumah_id',
        'iuran_kebersihan',
        'iuran_satpam',
        'status',
        'tanggal_pembayaran',
        'bulan_dibayar',   
        'full_year',         
    ];

    protected $casts = [
        'iuran_kebersihan' => 'float',
        'iuran_satpam' => 'float',
        'tanggal_pembayaran' => 'datetime',
        'bulan_dibayar' => 'array',     
        'full_year' => 'boolean',     
    ];

    public function penghuni()
    {
        return $this->belongsTo(Penghuni::class);
    }

    public function rumah()
    {
        return $this->belongsTo(Rumah::class);
    }

    public function getTanggalPembayaranFormattedAttribute()
    {
        return Carbon::parse($this->tanggal_pembayaran)->translatedFormat('d F Y');
    }
}
