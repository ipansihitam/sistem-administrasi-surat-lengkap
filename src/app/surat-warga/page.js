import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SuratWargaClient from "./client";

// Helper function to convert Firestore Timestamps to ISO strings
const serializeTimestamps = (data) => {
    const serializedData = {};
    for (const key in data) {
        // Check if the key is own property and the value is a Timestamp-like object
        if (Object.prototype.hasOwnProperty.call(data, key) && data[key] && typeof data[key].toDate === 'function') {
            serializedData[key] = data[key].toDate().toISOString();
        } else {
            serializedData[key] = data[key];
        }
    }
    return serializedData;
};


async function getAllSurat() {
    try {
        const suratCollectionRef = collection(db, 'surat');
        const q = query(suratCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const surat = querySnapshot.docs.map(doc => {
            const data = doc.data();
            
            // Serialize the data, converting all Timestamps
            const serializedData = serializeTimestamps(data);

            return {
                id: doc.id,
                ...serializedData,
            };
        });
        return surat;
    } catch (error) {
        console.error("Gagal mengambil data surat dari Firestore:", error);
        // In case of an error, return an empty array to prevent the page from crashing.
        return [];
    }
}

export default async function SuratWargaPage() {
    const allSurat = await getAllSurat();

    return <SuratWargaClient allSurat={allSurat} />;
}
