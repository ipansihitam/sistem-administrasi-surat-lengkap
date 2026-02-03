import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import InputSuratUmumClient from './client';

export const dynamic = 'force-dynamic';

// Fungsi untuk mengambil data surat berdasarkan ID
async function getSuratById(id) {
    if (!id) return null;
    try {
        const docRef = doc(db, 'surat', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Format tanggal agar sesuai dengan input type="date" (YYYY-MM-DD)
            const formattedDate = data.tanggalSurat ? new Date(data.tanggalSurat.toDate()).toISOString().split('T')[0] : '';
            return {
                id: docSnap.id,
                ...data,
                tanggalSurat: formattedDate,
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching document: ", error);
        return null;
    }
}

// Komponen halaman utama untuk input/edit surat
export default async function InputSuratUmumPage({ searchParams }) {
    const { id } = searchParams;
    const initialData = await getSuratById(id);

    // Suspense Boundary diperlukan karena kita menggunakan useSearchParams di client
    return (
        <InputSuratUmumClient initialData={initialData || {}} />
    );
}
