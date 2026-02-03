import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import KelahiranClient from './client';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Data Kelahiran',
    description: 'Halaman untuk mengelola data kelahiran warga.',
};

async function getAllKelahiran() {
    const suratCol = collection(db, 'surat');
    const q = query(suratCol, 
        where("jenisSurat", "==", "Kelahiran"), 
        orderBy("createdAt", "desc")
    );
    const suratSnapshot = await getDocs(q);

    const allKelahiran = suratSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data, // Ini akan menyertakan `formData`, `createdAt`, dll.
            createdAt: data.createdAt?.toDate().toISOString() || null,
        };
    });

    return allKelahiran;
}

export default async function KelahiranPage() {
    const allKelahiran = await getAllKelahiran();
    return <KelahiranClient allKelahiran={allKelahiran} />;
}
