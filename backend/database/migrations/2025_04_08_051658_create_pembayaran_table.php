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
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penghuni_id')->constrained('penghuni')->onDelete('cascade');
            $table->foreignId('rumah_id')->constrained('rumah')->onDelete('cascade');
            $table->timestamp('tanggal_pembayaran');
            $table->decimal('iuran_kebersihan', 10, 2);
            $table->decimal('iuran_satpam', 10, 2);
            $table->enum('status', ['lunas', 'belum']);
            $table->json('bulan_dibayar')->nullable(); 
            $table->boolean('full_year')->default(false);
            $table->timestamps();
        });
    }
    
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
