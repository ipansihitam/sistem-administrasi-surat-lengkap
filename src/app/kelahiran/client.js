'use client';

import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FormulirKelahiranTemplate from './FormulirKelahiranTemplate';
import SuratPreviewModal from '../../components/SuratPreviewModal';

const constructDate = (tgl, bln, thn) => {
    if (thn && bln && tgl) {
        return new Date(thn, bln - 1, tgl).toISOString();
    }
    return null;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date(dateString));
};

const DataSection = ({ title, data, columns, onDownload, onPreview }) => {
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
                <tr key={item.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onPreview(item.id)}>
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {col.key === 'actions' ? (
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => {e.stopPropagation(); onDownload(item.id, 'pdf')}} className="text-red-500 hover:text-red-700 font-semibold">PDF</button>
                          <span className="text-slate-300">|</span>
                          <button onClick={(e) => {e.stopPropagation(); onDownload(item.id, 'jpeg')}} className="text-blue-500 hover:text-blue-700 font-semibold">JPEG</button>
                        </div>
                      ) : col.isDate ? (
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
                <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-500">Tidak ada data kelahiran yang tersedia.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function KelahiranClient({ allKelahiran }) {
    const [suratForDownload, setSuratForDownload] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [previewKelahiran, setPreviewKelahiran] = useState(null);
    const templateRef = useRef();

    const tableData = allKelahiran.map(surat => ({
        id: surat.id,
        namaBayi: surat.formData?.anak_nama,
        tanggalLahir: constructDate(
            surat.formData?.anak_tgllahir_tgl,
            surat.formData?.anak_tgllahir_bln,
            surat.formData?.anak_tgllahir_thn
        ),
        namaAyah: surat.formData?.ayah_nama,
        namaIbu: surat.formData?.ibu_nama,
    }));

    const findSuratById = (id) => allKelahiran.find(s => s.id === id);

    const handlePreview = (id) => {
        const surat = findSuratById(id);
        if (surat) {
            setPreviewKelahiran({ ...surat, jenisSurat: 'Kelahiran' });
        }
    };

    const handleDownload = async (id, format) => {
        const suratToDownload = findSuratById(id);
        if (!suratToDownload) return;

        let choice;
        do {
            choice = window.prompt("Pilih penandatangan:\n1. Kepala Desa (Nurdin, SE)\n2. Sekretaris Desa (Warsono)\n\nMasukkan nomor (1 atau 2):", "1");
            if (choice === null) return;
        } while (choice !== '1' && choice !== '2');

        const penandatangan = choice === '2' 
            ? { nama: 'WARSONO', jabatan: 'Sekretaris Desa Krakitan' } 
            : { nama: 'NURDIN, SE', jabatan: 'Kepala Desa Krakitan' };

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        const monthRoman = romanMonths[month - 1];
        const defaultNomorSurat = `474.1/.../${monthRoman}/${year}`;
        const nomorSurat = window.prompt("Masukkan Nomor Surat:", defaultNomorSurat);
        if (nomorSurat === null) return;

        const suratWithDetails = { 
            ...suratToDownload, 
            penandatangan, 
            nomorSurat, 
            tanggalSurat: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
        };

        setSuratForDownload(suratWithDetails);
        setIsDownloading(true);

        setTimeout(async () => {
            if (!templateRef.current) {
                console.error("Template reference not found.");
                setIsDownloading(false);
                setSuratForDownload(null);
                return;
            }

            try {
                const canvas = await html2canvas(templateRef.current, { scale: 3, useCORS: true, logging: true, backgroundColor: '#ffffff' });
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const fileName = `Surat_Kelahiran_${suratToDownload.formData.anak_nama.replace(/\s/g, '_')}`;

                if (format === 'pdf') {
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`${fileName}.pdf`);
                } else if (format === 'jpeg') {
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = `${fileName}.jpeg`;
                    link.click();
                }
            } catch(error) {
                console.error("Gagal saat membuat file:", error);
                alert("Gagal membuat file. Silakan cek konsol untuk detail.")
            }
            
            setIsDownloading(false);
            setSuratForDownload(null);
        }, 500);
    };
    
    const columnsKelahiran = [
        { key: 'namaBayi', label: 'Nama Bayi' },
        { key: 'tanggalLahir', label: 'Tanggal Lahir', isDate: true },
        { key: 'namaAyah', label: 'Nama Ayah' },
        { key: 'namaIbu', label: 'Nama Ibu' },
        { key: 'actions', label: 'Aksi' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hidden template for downloads */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', backgroundColor: 'white' }}>
                {suratForDownload && <FormulirKelahiranTemplate ref={templateRef} surat={suratForDownload} />}
            </div>

            {/* Downloading overlay */}
            {isDownloading && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center' }}>
                     <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
                    <p style={{ color: 'white', fontSize: '20px', marginTop: '20px' }}>Mempersiapkan file, mohon tunggu...</p>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Data Kelahiran</h1>
                        <p className="text-lg text-slate-600 mt-2">Kelola semua data kelahiran yang telah terdaftar.</p>
                    </div>
                </div>
                
                <DataSection 
                    title="Daftar Kelahiran Tercatat" 
                    data={tableData} 
                    columns={columnsKelahiran} 
                    onDownload={handleDownload} 
                    onPreview={handlePreview}
                />
            </div>

            {previewKelahiran && 
                <SuratPreviewModal 
                    surat={previewKelahiran} 
                    onClose={() => setPreviewKelahiran(null)} 
                    onDownloadPDF={() => handleDownload(previewKelahiran.id, 'pdf')}
                    onDownloadJPEG={() => handleDownload(previewKelahiran.id, 'jpeg')}
                />}
        </div>
    );
}
