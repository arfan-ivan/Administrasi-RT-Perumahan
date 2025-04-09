<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pengeluaran;

class PengeluaranController extends Controller
{
    public function index()
    {
        return Pengeluaran::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'nullable|string',
            'jumlah' => 'required|numeric',
            'deskripsi' => 'nullable|string',
        ]);

        $pengeluaran = Pengeluaran::create($validated);
        return response()->json($pengeluaran, 201);
    }

    public function show($id)
    {
        return Pengeluaran::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $pengeluaran = Pengeluaran::findOrFail($id);

        $validated = $request->validate([
            'tanggal' => 'sometimes|required|date',
            'kategori' => 'nullable|string',
            'jumlah' => 'sometimes|required|numeric',
            'deskripsi' => 'nullable|string',
        ]);

        $pengeluaran->update($validated);
        return response()->json($pengeluaran);
    }

    public function destroy($id)
    {
        $pengeluaran = Pengeluaran::findOrFail($id);
        $pengeluaran->delete();
        return response()->json(['message' => 'Pengeluaran berhasil dihapus.']);
    }
}