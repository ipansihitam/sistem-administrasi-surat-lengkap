'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, FileUp, FileDown, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

const getTanggal = (surat) => {
    if (surat.createdAt?.toDate) {
        return surat.createdAt.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return '-';
};

export default function SuratMasukKeluarClient({ allSurat = [] }) {
    const [activeTab, setActiveTab] = useState('suratMasuk');
    const [searchTerm, setSearchTerm] = useState('');
    const [suratList, setSuratList] = useState([]);

    useEffect(() => {
        setSuratList(allSurat);
    }, [allSurat]);

    const filteredSurat = useMemo(() => {
        let filtered = suratList.filter(s => s.kategori === activeTab);

        if (searchTerm) {
            filtered = filtered.filter(s =>
                (s.perihal && s.perihal.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (s.nomorSurat && s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (s.pengirim && s.pengirim.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (s.tujuan && s.tujuan.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return filtered;
    }, [suratList, activeTab, searchTerm]);

    const columns = [
        { key: 'nomorSurat', header: 'Nomor Surat' },
        { key: 'tanggalSurat', header: 'Tanggal Surat', render: s => s.tanggalSurat ? new Date(s.tanggalSurat).toLocaleDateString('id-ID') : '-' },
        { key: 'pengirimTujuan', header: activeTab === 'suratMasuk' ? 'Pengirim' : 'Tujuan', render: s => s[activeTab === 'suratMasuk' ? 'pengirim' : 'tujuan'] },
        { key: 'perihal', header: 'Perihal' },
        // --- PERBAIKAN: Kolom Aksi sengaja dikosongkan sesuai permintaan ---
        { key: 'aksi', header: 'Aksi', render: () => <div className="text-center">-</div> },
    ];
    

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
                        <Search className="h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari perihal, nomor, pengirim/tujuan..."
                            className="bg-transparent focus:outline-none text-sm text-gray-700 w-full ml-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link href="/surat-masuk-keluar/tambah">
                        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-5 py-2.5 text-sm w-full sm:w-auto hover:bg-blue-700 transition-colors duration-200 shadow-sm">
                            <Plus className="h-5 w-5" />
                            <span>Tambah Surat</span>
                        </button>
                    </Link>
                </div>
            </div>

            <div className="border-b border-gray-200">
                <div className="-mb-px flex px-6" aria-label="Tabs">
                    <button 
                        onClick={() => setActiveTab('suratMasuk')} 
                        className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'suratMasuk' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        <FileDown className="h-5 w-5" /> Surat Masuk
                    </button>
                    <button 
                        onClick={() => setActiveTab('suratKeluar')} 
                        className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8 transition-colors ${activeTab === 'suratKeluar' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        <FileUp className="h-5 w-5" /> Surat Keluar
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSurat.length > 0 ? (
                            filteredSurat.map(surat => (
                                <tr key={surat.id} className="hover:bg-gray-50/50 transition-colors">
                                    {columns.map(col => (
                                        <td key={col.key} className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {col.render ? col.render(surat) : surat[col.key] || '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-16 text-gray-500">
                                    <p className="font-medium">Tidak ada data surat</p>
                                    <p className="text-xs mt-1">Belum ada surat yang sesuai dengan filter atau pencarian Anda.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
