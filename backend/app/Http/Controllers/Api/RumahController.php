<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rumah;
use App\Models\HistoriPenghuni;
use App\Models\Penghuni;
use Illuminate\Support\Facades\DB;

class RumahController extends Controller
{
    public function index()
    {
        return Rumah::with(['historiPenghuni', 'penghuniSaatIni'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|string|unique:rumah',
            'status' => 'required|in:dihuni,tidak dihuni',
        ]);

        $rumah = Rumah::create($validated);
        return response()->json($rumah, 201);
    }

    public function show($id)
    {
        return Rumah::with(['historiPenghuni', 'penghuniSaatIni'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $rumah = Rumah::findOrFail($id);

        $validated = $request->validate([
            'nomor_rumah' => 'sometimes|required|string|unique:rumah,nomor_rumah,' . $id,
            'status' => 'sometimes|required|in:dihuni,tidak dihuni',
        ]);

        $rumah->update($validated);
        return response()->json($rumah);
    }

    public function destroy($id)
    {
        $rumah = Rumah::findOrFail($id);
        $rumah->delete();
        return response()->json(['message' => 'Rumah berhasil dihapus.']);
    }

    public function isiPenghuni(Request $request, $id)
    {
        $request->validate([
            'penghuni_id' => 'required|exists:penghuni,id',
            'tanggal_masuk' => 'required|date',
        ]);

        return DB::transaction(function () use ($request, $id) {
            $rumah = Rumah::findOrFail($id);

            HistoriPenghuni::where('rumah_id', $id)
                ->whereNull('tanggal_keluar')
                ->update(['tanggal_keluar' => now()]);

            $histori = HistoriPenghuni::create([
                'rumah_id' => $id,
                'penghuni_id' => $request->penghuni_id,
                'tanggal_masuk' => $request->tanggal_masuk,
                'tanggal_keluar' => null,
            ]);

            $rumah->update(['status' => 'dihuni']);

            return response()->json([
                'message' => 'Penghuni berhasil ditambahkan',
                'data' => $histori->load('penghuni')
            ]);
        });
    }

}
