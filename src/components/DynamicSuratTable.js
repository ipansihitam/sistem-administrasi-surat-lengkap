// src/components/DynamicSuratTable.js

import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { FileText } from 'lucide-react';
import ResetSuratButton from './ResetSuratButton';

/**
 * Mengambil semua jenis surat dari koleksi pusat 'surat'.
 * Ini memastikan bahwa data yang ditampilkan selalu sinkron dengan sumber data utama,
 * sama seperti yang ditampilkan di halaman "Arsip Surat Terpadu".
 */
async function fetchAllSuratFromCentralCollection() {
    try {
        // Kueri yang benar: Mengambil dari koleksi 'surat', diurutkan berdasarkan tanggal dibuat.
        const q = query(collection(db, "surat"), orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("Tidak ada dokumen yang ditemukan di koleksi 'surat'.");
            return [];
        }

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            const tanggal = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();

            // Memetakan data dari database ke format yang dibutuhkan tabel
            return {
                id: doc.id,
                jenis: data.jenisSurat ? `Surat ${data.jenisSurat}` : 'Surat Lainnya',
                nama_pemohon: data.nama || 'Nama tidak tersedia',
                tanggal: tanggal.toISOString().split('T')[0], // Format YYYY-MM-DD
                status: data.status || 'Diajukan',
            };
        });
    } catch (error) {
        // Menangkap dan melaporkan error jika kueri gagal (mis. perlu indeks)
        console.error("KESALAHAN saat mengambil data dari koleksi 'surat':", error);
        return [];
    }
}

// Fungsi untuk mendapatkan warna chip status
const getStatusChip = (status) => {
    switch (status) {
        case 'Selesai': return 'bg-green-100 text-green-800';
        case 'Diajukan':
        case 'Diproses': return 'bg-yellow-100 text-yellow-800';
        case 'Ditolak': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

// Komponen utama (Server Component)
export default async function DynamicSuratTable() {
    // Memanggil fungsi yang sudah diperbaiki untuk mengambil data
    const allSurat = await fetchAllSuratFromCentralCollection();

    return (
        <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Tracking Surat Terbaru</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Memantau status surat yang diajukan oleh warga secara real-time.
                    </p>
                </div>
                <ResetSuratButton />
            </div>

            {allSurat.length === 0 ? (
                <div className="text-center py-12 px-6">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Belum Ada Pengajuan Surat</h3>
                    <p className="mt-2 text-sm text-gray-500">Data pengajuan surat akan muncul di sini setelah warga mengajukannya.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis Surat</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Pemohon</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allSurat.map((surat) => (
                                <tr key={surat.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{surat.jenis}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{surat.nama_pemohon}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{surat.tanggal}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(surat.status)}`}>
                                            {surat.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
