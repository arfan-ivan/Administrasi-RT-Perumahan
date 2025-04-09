<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pembayaran;
use App\Models\Pengeluaran;
use Illuminate\Support\Facades\DB;
use App\Models\Rumah;
use App\Models\Penghuni;
use App\Models\HistoriPenghuni;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function summary()
    {
        $pemasukan = Pembayaran::selectRaw('DATE_FORMAT(tanggal_pembayaran, "%Y-%m") as bulan, SUM(iuran_kebersihan + iuran_satpam) as total')
            ->groupBy(DB::raw('DATE_FORMAT(tanggal_pembayaran, "%Y-%m")'))
            ->orderBy('bulan')
            ->get();

        $pengeluaran = Pengeluaran::selectRaw('DATE_FORMAT(tanggal, "%Y-%m") as bulan, SUM(jumlah) as total')
            ->groupBy(DB::raw('DATE_FORMAT(tanggal, "%Y-%m")'))
            ->orderBy('bulan')
            ->get();

        $report = [];
        $bulanList = collect($pemasukan)->pluck('bulan')->merge($pengeluaran->pluck('bulan'))->unique()->sort();

        foreach ($bulanList as $bulan) {
            $masuk = $pemasukan->firstWhere('bulan', $bulan)?->total ?? 0;
            $keluar = $pengeluaran->firstWhere('bulan', $bulan)?->total ?? 0;
            $saldo = $masuk - $keluar;

            $report[] = [
                'bulan' => $bulan, 
                'pemasukan' => (float) $masuk,
                'pengeluaran' => (float) $keluar,
                'saldo' => (float) $saldo, 
            ];
        }

        return response()->json($report);
    }

    public function detail($bulan)
    {
        $pemasukan = Pembayaran::with('penghuni')
            ->where('tanggal_pembayaran', 'like', $bulan . '%') 
            ->get();

        $pengeluaran = Pengeluaran::where('tanggal', 'like', $bulan . '%')
            ->get();

        return response()->json([
            'bulan' => $bulan,
            'pemasukan' => $pemasukan,
            'pengeluaran' => $pengeluaran,
        ]);
    }

    public function dashboardStats()
    {
        $penghuniAktif = HistoriPenghuni::with('penghuni', 'rumah')
            ->whereNull('tanggal_keluar')
            ->get();

        $penghuniTetap = $penghuniAktif->where('penghuni.status_penghuni', 'tetap')->count();
        $penghuniKontrak = $penghuniAktif->where('penghuni.status_penghuni', 'kontrak')->count();

        $totalRumah = Rumah::count();
        $rumahDihuni = $penghuniAktif->pluck('rumah_id')->unique()->count();
        $rumahKosong = $totalRumah - $rumahDihuni;

        return response()->json([
            'penghuni_tetap' => $penghuniTetap,
            'penghuni_kontrak' => $penghuniKontrak,
            'rumah_dihuni' => $rumahDihuni,
            'rumah_kosong' => $rumahKosong,
        ]);
    }
}
