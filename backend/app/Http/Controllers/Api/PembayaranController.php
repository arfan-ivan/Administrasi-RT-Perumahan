<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pembayaran;
use App\Models\Penghuni;
use App\Models\HistoriPenghuni;
use Carbon\Carbon;

class PembayaranController extends Controller
{
    public function index()
    {
        return Pembayaran::with(['penghuni', 'rumah'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'penghuni_id' => 'required|exists:penghuni,id',
            'tanggal_pembayaran' => 'required|date',
            'iuran_kebersihan' => 'required|numeric',
            'iuran_satpam' => 'required|numeric',
            'status' => 'required|in:lunas,belum',
            'bulan_dibayar' => 'nullable|array',
            'bulan_dibayar.*' => 'string',
            'full_year' => 'nullable|boolean',
        ]);

        $histori = HistoriPenghuni::where('penghuni_id', $validated['penghuni_id'])
            ->orderByDesc('created_at')
            ->first();

        if (!$histori) {
            return response()->json(['message' => 'Penghuni belum memiliki histori rumah.'], 422);
        }

        $validated['rumah_id'] = $histori->rumah_id;
        $validated['tanggal_pembayaran'] = Carbon::parse($validated['tanggal_pembayaran']);

        $pembayaran = Pembayaran::create($validated);
        return response()->json($pembayaran, 201);
    }

    public function show($id)
    {
        return Pembayaran::with(['penghuni', 'rumah'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $pembayaran = Pembayaran::findOrFail($id);

        $validated = $request->validate([
            'penghuni_id' => 'sometimes|required|exists:penghuni,id',
            'tanggal_pembayaran' => 'sometimes|required|date',
            'iuran_kebersihan' => 'sometimes|required|numeric',
            'iuran_satpam' => 'sometimes|required|numeric',
            'status' => 'sometimes|required|in:lunas,belum',
            'bulan_dibayar' => 'nullable|array',
            'bulan_dibayar.*' => 'string',
            'full_year' => 'nullable|boolean',
        ]);

        if (isset($validated['penghuni_id'])) {
            $histori = HistoriPenghuni::where('penghuni_id', $validated['penghuni_id'])
                ->orderByDesc('created_at')
                ->first();

            if (!$histori) {
                return response()->json(['message' => 'Penghuni belum memiliki histori rumah.'], 422);
            }

            $validated['rumah_id'] = $histori->rumah_id;
        }

        if (isset($validated['tanggal_pembayaran'])) {
            $validated['tanggal_pembayaran'] = Carbon::parse($validated['tanggal_pembayaran']);
        }

        $pembayaran->update($validated);
        return response()->json($pembayaran);
    }

    public function destroy($id)
    {
        $pembayaran = Pembayaran::findOrFail($id);
        $pembayaran->delete();
        return response()->json(['message' => 'Data pembayaran berhasil dihapus.']);
    }
}
