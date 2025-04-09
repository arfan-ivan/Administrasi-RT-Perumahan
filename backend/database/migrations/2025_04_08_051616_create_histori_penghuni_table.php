<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('histori_penghuni', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('rumah_id');
            $table->unsignedBigInteger('penghuni_id');

            $table->date('tanggal_masuk');
            $table->date('tanggal_keluar')->nullable();
            $table->timestamps();

            $table->foreign('rumah_id')->references('id')->on('rumah')->onDelete('cascade');
            $table->foreign('penghuni_id')->references('id')->on('penghuni')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('histori_penghuni');
    }
};
