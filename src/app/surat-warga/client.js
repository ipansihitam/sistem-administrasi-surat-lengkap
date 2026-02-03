
'use client';

import Link from 'next/link';
import { useState, useRef, useTransition, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SuratTemplate from './SuratTemplate';
import { deleteAllSuratWarga } from './actions';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }).format(date);
};

const DataSection = ({ title, data, columns, onDownload }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-5">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100 rounded-t-lg">
            <tr>
              {columns.map(col => <th key={col.key} className="px-6 py-4 font-semibold">{col.label}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data && data.length > 0 ? (
              data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {col.key === 'actions' ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => onDownload(item, 'pdf')} className="text-red-500 hover:text-red-700 font-semibold">PDF</button>
                          <span className="text-slate-300">|</span>
                          <button onClick={() => onDownload(item, 'jpeg')} className="text-blue-500 hover:text-blue-700 font-semibold">JPEG</button>
                        </div>
                      ) : col.key === 'tanggalSurat' ? (
                        formatDate(item[col.key])
                      ) : (
                        item[col.key] || '-'
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-500">Tidak ada data yang tersedia.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function SuratWargaClient({ allSurat }) {
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [downloadFormat, setDownloadFormat] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const templateRef = useRef();

    const handleReset = async () => {
        const confirmed = window.confirm('Apakah Anda yakin ingin menghapus semua data surat warga? Tindakan ini tidak dapat dibatalkan.');
        if (confirmed) {
            startTransition(async () => {
                const result = await deleteAllSuratWarga();
                alert(result.message);
                window.location.reload();
            });
        }
    };

    const handleDownload = (surat, format) => {
        let choice;
        do {
            choice = window.prompt("Pilih penandatangan:\n1. Kepala Desa (Nurdin, SE)\n2. Sekretaris Desa (Warsono)\n\nMasukkan nomor (1 atau 2):", "1");
            if (choice === null) return;
        } while (choice !== '1' && choice !== '2');

        const { nama: namaPenandatangan, jabatan: jabatanPenandatangan } = choice === '2' 
            ? { nama: 'WARSONO', jabatan: 'Sekretaris Desa Krakitan' } 
            : { nama: 'NURDIN, SE', jabatan: 'Kepala Desa Krakitan' };

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        const monthRoman = romanMonths[month - 1];
        
        const suratCode = surat.jenisSurat === 'usaha' ? '503' : '045.2';
        const defaultNomorSurat = `${suratCode}/.../${monthRoman}/${year}`;

        const nomorSurat = window.prompt("Masukkan Nomor Surat:", defaultNomorSurat);
        if (nomorSurat === null) return;

        const suratWithDetails = { 
            ...surat, 
            namaPenandatangan,
            jabatanPenandatangan, 
            nomorSurat 
        };

        setSelectedSurat(suratWithDetails);
        setDownloadFormat(format);
        setIsDownloading(true);
    };

    useEffect(() => {
        if (isDownloading && selectedSurat && templateRef.current) {
            const generateFile = async () => {
                try {
                    const canvas = await html2canvas(templateRef.current, { scale: 3, useCORS: true, logging: true });
                    const imgData = canvas.toDataURL('image/png');
                    const fileName = `Surat_${selectedSurat.jenisSurat.replace(/\s/g, '_')}_${selectedSurat.nama.replace(/\s/g, '_')}`;

                    if (downloadFormat === 'pdf') {
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        pdf.save(`${fileName}.pdf`);
                    } else if (downloadFormat === 'jpeg') {
                        const link = document.createElement('a');
                        link.href = imgData;
                        link.download = `${fileName}.jpeg`;
                        link.click();
                    }
                } catch(error) {
                    console.error("Error during file generation:", error);
                    alert("Gagal membuat file. Silakan coba lagi.")
                } finally {
                    setIsDownloading(false);
                    setSelectedSurat(null);
                    setDownloadFormat(null);
                }
            };

            generateFile();
        }
    }, [isDownloading, selectedSurat, downloadFormat]);
    
    const columnsSuratKeteranganUsaha = [
        { key: 'nama', label: 'Nama Pemohon' },
        { key: 'nik', label: 'NIK' },
        { key: 'namaUsaha', label: 'Nama Usaha' },
        { key: 'jenisUsaha', label: 'Digunakan Untuk' },
        { key: 'tanggalSurat', label: 'Tanggal Dibuat' },
        { key: 'actions', label: 'Aksi' },
    ];

    const columnsCommon = [
        { key: 'nama', label: 'Nama Pemohon' },
        { key: 'keperluan', label: 'Keperluan' },
        { key: 'berlaku', label: 'Berlaku' },
        { key: 'tanggalSurat', label: 'Tanggal Dibuat' },
        { key: 'actions', label: 'Aksi' },
    ];

    const suratKeteranganUsaha = allSurat.filter(s => s.jenisSurat === 'usaha');
    const suratKeterangan = allSurat.filter(s => s.jenisSurat === 'keterangan');
    const suratPengantar = allSurat.filter(s => s.jenisSurat === 'pengantar');
    const suratKeteranganTidakMampu = allSurat.filter(s => s.jenisSurat === 'tidak_mampu');

    return (
        <div className="min-h-screen bg-slate-50">
             <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', backgroundColor: 'white' }}>
                {selectedSurat && <SuratTemplate ref={templateRef} surat={selectedSurat} />}
            </div>

            {(isDownloading || isPending) && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'white', fontSize: '20px' }}>{isPending ? 'Menghapus data...' : 'Mempersiapkan file unduhan...'}</p>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
                    <div className="mb-6 sm:mb-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Layanan Surat Warga</h1>
                        <p className="text-lg text-slate-600 mt-2">Buat dan kelola surat keterangan untuk warga secara mudah.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleReset} disabled={isPending} className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50">
                            Reset Semua Surat
                        </button>
                        <Link href="/surat-warga/input" className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            + Buat Surat Baru
                        </Link>
                    </div>
                </div>
                
                <DataSection 
                    title="Surat Keterangan Usaha" 
                    data={suratKeteranganUsaha} 
                    columns={columnsSuratKeteranganUsaha} 
                    onDownload={handleDownload} 
                />
                 <DataSection 
                    title="Surat Keterangan" 
                    data={suratKeterangan} 
                    columns={columnsCommon} 
                    onDownload={handleDownload} 
                />
                <DataSection 
                    title="Surat Pengantar" 
                    data={suratPengantar} 
                    columns={columnsCommon} 
                    onDownload={handleDownload} 
                />
                <DataSection 
                    title="Surat Keterangan Tidak Mampu" 
                    data={suratKeteranganTidakMampu} 
                    columns={columnsCommon} 
                    onDownload={handleDownload} 
                />
            </div>
        </div>
    );
}
