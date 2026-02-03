import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SuratListClient from './client';

export const dynamic = 'force-dynamic';

// --- PERBAIKAN: Fungsi ini sekarang HANYA mengambil surat selain surat umum ---
async function getAllSuratExceptUmum() {
    try {
        // Query untuk mengambil semua surat KECUALI yang suratType-nya 'umum'
        const q = query(
            collection(db, 'surat'), 
            where('suratType', '!=', 'umum'), // <-- LOGIKA UTAMA: Tidak sama dengan 'umum'
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("Tidak ada dokumen surat (non-umum) yang ditemukan.");
            return [];
        }

        const suratList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString() || null,
        }));

        return suratList;
    } catch (error) {
        console.error("Error fetching non-umum surat: ", error);
        // Jika terjadi error, kita coba ambil semua surat sebagai fallback 
        // agar aplikasi tidak sepenuhnya rusak, meskipun ini kurang ideal.
        try {
            const fallbackQuery = query(collection(db, 'surat'), orderBy('createdAt', 'desc'));
            const fallbackSnapshot = await getDocs(fallbackQuery);
            const fallbackList = fallbackSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toISOString() || null,
            }));
            // Filter di sisi klien sebagai upaya terakhir
            return fallbackList.filter(s => s.suratType !== 'umum');
        } catch (fallbackError) {
            console.error("Fallback fetch error: ", fallbackError);
            return []; // Kembalikan array kosong jika semua gagal
        }
    }
}

export default async function ArsipPage() {
    // Panggil fungsi yang sudah diperbarui
    const allSurat = await getAllSuratExceptUmum();

    return (
        <SuratListClient allSurat={allSurat} />
    );
}
