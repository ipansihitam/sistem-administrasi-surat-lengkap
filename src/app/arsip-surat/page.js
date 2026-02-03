// src/app/arsip-surat/page.js
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import ArsipSuratClient from "./ArsipSuratClient";

// Fungsi untuk mengambil semua data surat dari Firestore
async function getSurat() {
    const suratCollectionRef = collection(db, 'surat');
    const q = query(suratCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const allSurat = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Serialize a data, convertendo todos os Timestamps
        const serializedData = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key) && data[key] && typeof data[key].toDate === 'function') {
                serializedData[key] = data[key].toDate().toISOString();
            } else {
                serializedData[key] = data[key];
            }
        }

        return {
            id: doc.id,
            ...serializedData,
        };
    });

    return allSurat;
}

// Komponen Server untuk Halaman Arsip Terpadu
export default async function ArsipSuratPage() {
  const allSurat = await getSurat();

  return (
    <main className="min-h-screen bg-gray-50">
       <ArsipSuratClient allSurat={allSurat} />
    </main>
  );
}
