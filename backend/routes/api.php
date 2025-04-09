<?php

use App\Http\Controllers\Api\PenghuniController;
use App\Http\Controllers\Api\RumahController;
use App\Http\Controllers\Api\PembayaranController;
use App\Http\Controllers\Api\PengeluaranController;
use App\Http\Controllers\Api\ReportController;

Route::prefix('v1')->group(function () {
    Route::apiResource('penghuni', PenghuniController::class);
    Route::apiResource('rumah', RumahController::class);
    Route::apiResource('pembayaran', PembayaranController::class);
    Route::apiResource('pengeluaran', PengeluaranController::class);
    
    Route::post('rumah/{id}/isi-penghuni', [RumahController::class, 'isiPenghuni']);
    Route::get('/dashboard/stats', [ReportController::class, 'dashboardStats']);

    Route::get('report/summary', [\App\Http\Controllers\Api\ReportController::class, 'summary']);
    Route::get('report/detail/{bulan}', [\App\Http\Controllers\Api\ReportController::class, 'detail']);
});

