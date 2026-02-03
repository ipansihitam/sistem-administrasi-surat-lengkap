'use client';

import { useState, useTransition } from 'react';
import { deleteAllSurat } from './actions';
import SuratPreviewModal from '../../components/SuratPreviewModal';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
};

const ArsipSuratClient = ({ allSurat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReset = async () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus semua arsip surat? Tindakan ini tidak dapat dibatalkan.');
    if (confirmed) {
      startTransition(async () => {
        const result = await deleteAllSurat();
        alert(result.message);
        if (result.success) {
          window.location.reload();
        }
      });
    }
  };

  const openPreview = (surat) => {
    setSelectedSurat(surat);
    setIsModalOpen(true);
  };

  const filteredSurat = allSurat.filter(surat => {
    const searchTermLower = searchTerm.toLowerCase();
    const isMatch = (
      surat.keperluan?.toLowerCase().includes(searchTermLower) ||
      surat.nomorSurat?.toLowerCase().includes(searchTermLower) ||
      surat.nama?.toLowerCase().includes(searchTermLower)
    );
    return isMatch;
  });

  const getJenisSuratLabel = (jenis) => {
    switch (jenis) {
      case 'keterangan': return 'Surat Keterangan';
      case 'pengantar': return 'Surat Pengantar';
      case 'usaha': return 'Surat Keterangan Usaha';
      case 'tidak_mampu': return 'Surat Keterangan Tidak Mampu';
      default: return jenis;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Arsip Surat Terpadu</h1>
                <p className="text-slate-600 mt-1">Kelola semua jenis surat yang telah dibuat secara terpusat.</p>
            </div>
            <button 
                onClick={handleReset} 
                disabled={isPending} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                {isPending ? 'Menghapus...' : 'Reset Semua Surat'}
            </button>
        </div>
        <div className="relative">
            <input
                type="text"
                placeholder="Cari berdasarkan perihal, nomor, nama pemohon..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
             <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="min-w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100 rounded-t-lg">
            <tr>
              <th className="px-6 py-4 font-semibold">Jenis Surat</th>
              <th className="px-6 py-4 font-semibold">Perihal</th>
              <th className="px-6 py-4 font-semibold">Nomor Surat</th>
              <th className="px-6 py-4 font-semibold">Nama Pemohon</th>
              <th className="px-6 py-4 font-semibold">Tanggal Dibuat</th>
              <th className="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredSurat.length > 0 ? (
              filteredSurat.map(surat => (
                <tr key={surat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ surat.jenisSurat === 'usaha' ? 'bg-green-100 text-green-800' : surat.jenisSurat === 'tidak_mampu' ? 'bg-yellow-100 text-yellow-800' : 'bg-sky-100 text-sky-800' }`}>
                      {getJenisSuratLabel(surat.jenisSurat)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{surat.keperluan || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{surat.nomorSurat || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{surat.nama || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(surat.tanggalSurat)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => openPreview(surat)} className="text-sky-600 hover:text-sky-800 font-medium">Download</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-500">
                    <p className="text-lg font-medium">Tidak ada surat yang cocok dengan pencarian Anda.</p>
                    <p>Silakan coba kata kunci lain.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <SuratPreviewModal 
            surat={selectedSurat} 
            onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default ArsipSuratClient;
