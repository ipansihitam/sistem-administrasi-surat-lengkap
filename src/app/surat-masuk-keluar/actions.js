'use server';

import { db } from '../../lib/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function resetSemuaSurat() {
    console.log("Memulai proses reset semua data surat...");

    // --- PERBAIKAN: Menambahkan lebih banyak koleksi surat untuk direset ---
    const collectionsToDelete = [
        'surat_kelahiran',
        'surat_kematian',
        'pindah_wni',
        'surat_umum',
        'surat_warga' 
    ];
    const batch = writeBatch(db);

    try {
        for (const col of collectionsToDelete) {
            console.log(`Menghapus koleksi: ${col}`);
            const querySnapshot = await getDocs(collection(db, col));
            if (querySnapshot.empty) {
                console.log(`Koleksi ${col} sudah kosong.`);
                continue;
            }
            querySnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            console.log(`${querySnapshot.size} dokumen dari ${col} ditambahkan ke batch delete.`);
        }

        await batch.commit();
        console.log("Batch commit berhasil. Semua surat yang relevan telah dihapus.");

        // Revalidasi path untuk memastikan data segar ditampilkan
        revalidatePath('/'); // Revalidasi halaman utama
        revalidatePath('/surat-masuk-keluar');

        // --- PERBAIKAN: Menambahkan status keberhasilan untuk penanganan di sisi klien ---
        return { success: true, message: 'Berhasil! Semua data arsip surat telah direset.' };

    } catch (error) {
        console.error("Error saat mereset semua surat: ", error);
        return { success: false, message: `Gagal mereset data: ${error.message}` };
    }
}
