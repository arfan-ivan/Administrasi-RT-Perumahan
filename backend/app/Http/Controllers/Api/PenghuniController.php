<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penghuni;
use Illuminate\Support\Facades\Storage;

class PenghuniController extends Controller
{
    public function index()
    {
        return Penghuni::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string',
            'foto_ktp' => 'nullable|image|max:2048',
            'status_penghuni' => 'required|in:kontrak,tetap',
            'nomor_telepon' => 'required',
            'sudah_menikah' => 'required|boolean',
        ]);

        if ($request->hasFile('foto_ktp')) {
            $validated['foto_ktp'] = $request->file('foto_ktp')->store('ktp', 'public');
        }

        $penghuni = Penghuni::create($validated);
        return response()->json($penghuni, 201);
    }

    public function show($id)
    {
        return Penghuni::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $penghuni = Penghuni::findOrFail($id);

        $validated = $request->validate([
            'nama_lengkap' => 'sometimes|required|string',
            'foto_ktp' => 'nullable|image|max:2048',
            'status_penghuni' => 'sometimes|required|in:kontrak,tetap',
            'nomor_telepon' => 'sometimes|required',
            'sudah_menikah' => 'sometimes|required|boolean',
        ]);

        if ($request->hasFile('foto_ktp')) {
            if ($penghuni->foto_ktp) {
                Storage::disk('public')->delete($penghuni->foto_ktp);
            }
            $validated['foto_ktp'] = $request->file('foto_ktp')->store('ktp', 'public');
        }

        $penghuni->update($validated);
        return response()->json($penghuni);
    }
    public function destroy($id)
    {
        $penghuni = Penghuni::findOrFail($id);

        if ($penghuni->foto_ktp) {
            \Storage::disk('public')->delete($penghuni->foto_ktp);
        }

        $penghuni->delete();
        return response()->json(['message' => 'Penghuni berhasil dihapus.']);
    }

}
