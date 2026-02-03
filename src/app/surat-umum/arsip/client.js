'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, Edit, Download } from 'lucide-react';

// Helper Functions
const getNamaPemohon = (surat) => {
    if (!surat) return '-';
    // Hanya menangani surat umum, karena surat kependudukan tidak lagi di tabel ini
    return surat.pengirim || surat.tujuan || '-';
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

// Reusable Table Component
const SuratTable = ({ title, list, columns, searchTerm }) => {
    const filteredList = useMemo(() => {
        if (!list) return [];
        if (!searchTerm) return list;
        return list.filter(s => {
            const nama = getNamaPemohon(s) || '';
            return (
                (s.jenisSurat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.nomorSurat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.perihal || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [list, searchTerm]);

    if (filteredList.length === 0 && searchTerm) return null;

    // Aksi hanya ditampilkan jika BUKAN tabel surat umum
    const showAksi = title !== 'Kolom Masuk' && title !== 'Kolom Keluar' && title !== 'Arsip Surat Lainnya';

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">{title}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            {columns.map(col => <th key={col.key} className="px-4 py-3 text-left">{col.header}</th>)}
                            {showAksi && <th className="px-4 py-3 text-center">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredList.length > 0 ? (
                            filteredList.map(surat => (
                                <tr key={surat.id} className="hover:bg-gray-50">
                                    {columns.map(col => <td key={col.key} className="px-4 py-3 whitespace-nowrap text-gray-600">{col.render(surat)}</td>)}
                                    {showAksi && (
                                        <td className="px-4 py-3 whitespace-nowrap text-center space-x-3">
                                            <button className="text-gray-400 hover:text-blue-600"><Edit size={16} /></button>
                                            <button className="text-gray-400 hover:text-green-600"><Download size={16} /></button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={showAksi ? columns.length + 1 : columns.length} className="text-center py-8 text-gray-500">Tidak ada data yang cocok.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main Client Component
export default function ArsipClient({ allSurat }) {
    const [searchTerm, setSearchTerm] = useState('');

    // --- PERBAIKAN: Arsip Lainnya hanya berisi sisa surat umum ---
    const { suratMasuk, suratKeluar, arsipLainnya } = useMemo(() => {
        const allSuratMasuk = allSurat.filter(s => s.jenisSurat === 'Surat Masuk');
        const allSuratKeluar = allSurat.filter(s => s.jenisSurat === 'Surat Keluar');

        const suratMasuk = allSuratMasuk.slice(0, 10);
        const suratKeluar = allSuratKeluar.slice(0, 10);
        
        const arsipSuratMasuk = allSuratMasuk.slice(10);
        const arsipSuratKeluar = allSuratKeluar.slice(10);
        
        // Gabungkan HANYA sisa surat masuk dan keluar
        const combinedArsip = [...arsipSuratMasuk, ...arsipSuratKeluar];
        
        combinedArsip.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return {
            suratMasuk,
            suratKeluar,
            arsipLainnya: combinedArsip,
        };
    }, [allSurat]);

    const columnsUmum = [
        { key: 'nomorSurat', header: 'Nomor Surat', render: s => s.nomorSurat || '-' },
        { key: 'tanggal', header: 'Tanggal Surat', render: s => formatDate(s.tanggalSurat) },
        { key: 'pengirimTujuan', header: 'Pengirim/Tujuan', render: s => getNamaPemohon(s) },
        { key: 'perihal', header: 'Perihal', render: s => s.perihal || '-' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-800">Arsip Surat Terpadu</h1>
                    <p className="text-slate-600 mt-1">Kelola semua jenis surat yang telah dibuat secara terpusat.</p>
                </div>

                <div className="relative w-full mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan jenis, nama, nomor, atau perihal surat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />
                </div>

                <SuratTable title="Kolom Masuk" list={suratMasuk} columns={columnsUmum} searchTerm={searchTerm} />
                <SuratTable title="Kolom Keluar" list={suratKeluar} columns={columnsUmum} searchTerm={searchTerm} />
                {/* --- PERBAIKAN: Menggunakan columnsUmum karena hanya berisi surat umum --*/}
                {arsipLainnya.length > 0 && (
                    <SuratTable title="Arsip Surat Lainnya" list={arsipLainnya} columns={columnsUmum} searchTerm={searchTerm} />
                )}
            </div>
        </div>
    );
}
