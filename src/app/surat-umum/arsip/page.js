
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import ArsipClient from './client';

// Fungsi ini berjalan di server untuk mengambil SEMUA data surat
async function getSurat() {
  const suratRef = collection(db, 'surat');
  
  // --- DIKEMBALIKAN: Menghapus filter `where` untuk mengambil semua surat ---
  // Semua surat diurutkan berdasarkan tanggal pembuatan, dari yang terbaru.
  const q = query(suratRef, orderBy('createdAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  const suratDocs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Serialisasi data agar aman untuk diteruskan ke Client Component.
  const serializedSurat = suratDocs.map(s => {
    const serializableData = { ...s };
    for (const key in serializableData) {
      const value = serializableData[key];
      if (value && typeof value.toDate === 'function') {
        serializableData[key] = value.toDate().toISOString();
      }
    }
    return serializableData;
  });

  return serializedSurat;
}

// Komponen Server untuk Halaman Arsip Terpadu
export default async function ArsipPage() {
  // Mengambil semua data surat di sisi server
  const allSurat = await getSurat();

  // Melewatkan semua data ke komponen client untuk diproses dan ditampilkan
  return <ArsipClient allSurat={allSurat} />;
}
