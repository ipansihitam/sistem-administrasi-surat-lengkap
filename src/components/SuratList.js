'use client';

import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Impor Modal dan semua Template yang relevan
import SuratPreviewModal from './SuratPreviewModal';
import UpdateStatusModal from './UpdateStatusModal';
import FormulirKelahiranTemplate from '@/app/kelahiran/FormulirKelahiranTemplate';
import FormulirKematianTemplate from '@/app/kematian/FormulirKematianTemplate';
import FormulirPindahTemplate from '@/app/pindah-wni/FormulirPindahTemplate'; // Impor baru

// --- Helper Functions ---
const getStatusColor = (status) => {
    switch (status) {
        case 'Selesai': return 'bg-green-100 text-green-800';
        case 'Ditolak': return 'bg-red-100 text-red-800';
        case 'Sedang Diproses': return 'bg-blue-100 text-blue-800';
        case 'Belum Selesai': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function SuratList({ suratList }) {
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [suratToUpdate, setSuratToUpdate] = useState(null);
    const [suratToDownload, setSuratToDownload] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const templateRef = useRef();

    const handlePreviewClick = (surat) => setSelectedSurat(surat);
    const handleUpdateClick = (surat) => setSuratToUpdate(surat);
    const handleCloseModals = () => {
        setSelectedSurat(null);
        setSuratToUpdate(null);
    };

    const startDownload = async (format) => {
        if (!selectedSurat) return;

        // Validasi jenis surat yang didukung
        const supportedTypes = ['Kelahiran', 'Kematian', 'Pindah WNI'];
        if (!supportedTypes.includes(selectedSurat.jenisSurat)) {
            alert(`Fitur unduh belum tersedia untuk jenis surat "${selectedSurat.jenisSurat}".`);
            return;
        }
        
        const penandatanganChoice = window.prompt("Pilih penandatangan:\n1. Kepala Desa (Nurdin, SE)\n2. Sekretaris Desa (Warsono)", "1");
        if (!['1', '2'].includes(penandatanganChoice)) return;
        const penandatangan = penandatanganChoice === '1' 
            ? { nama: 'NURDIN, SE', jabatan: 'Kepala Desa Krakitan' }
            : { nama: 'WARSONO', jabatan: 'Sekretaris Desa Krakitan' };

        const noSurat = window.prompt("Masukkan Nomor Surat:", selectedSurat.no_surat || '...');
        if (noSurat === null) return;
        
        const suratWithDetails = {
            ...selectedSurat,
            penandatangan,
            nomorSurat: noSurat,
            tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        };
        
        setSuratToDownload(suratWithDetails);
        setIsDownloading(true);

        setTimeout(async () => {
            if (!templateRef.current) {
                console.error("Template ref not found");
                setIsDownloading(false);
                return;
            }

            const canvas = await html2canvas(templateRef.current, { scale: 3 });
            const imgData = canvas.toDataURL('image/png');
            
            // Logika penamaan file yang diperbarui
            let fileNamePrefix = `Surat_${selectedSurat.jenisSurat.replace(' ','_')}`;
            let namaPemohon = getNamaForDisplay(selectedSurat).replace(' ','_');
            const fileName = `${fileNamePrefix}_${namaPemohon}`;

            if (format === 'pdf') {
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${fileName}.pdf`);
            } else {
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `${fileName}.jpeg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            setIsDownloading(false);
            setSuratToDownload(null);
        }, 500);
    };

    const getNamaForDisplay = (surat) => {
        switch (surat.jenisSurat) {
            case 'Kelahiran': return surat.anak_nama;
            case 'Kematian': return surat.jenazah_nama;
            case 'Pindah WNI': return surat.pemohon_nama;
            default: return surat.nama || '-';
        }
    }

    return (
        <>
            <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', backgroundColor: 'white' }}>
                {suratToDownload && (
                    <div ref={templateRef}>
                        {/* Logika render template yang diperbarui */}
                        {suratToDownload.jenisSurat === 'Kelahiran' && <FormulirKelahiranTemplate surat={suratToDownload} />}
                        {suratToDownload.jenisSurat === 'Kematian' && <FormulirKematianTemplate surat={suratToDownload} />}
                        {suratToDownload.jenisSurat === 'Pindah WNI' && <FormulirPindahTemplate surat={suratToDownload} />}
                    </div>
                )}
            </div>

            {isDownloading && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <p style={{ color: 'white', fontSize: '22px', fontWeight: 'bold' }}>Mempersiapkan file unduhan...</p>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Surat</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pembuatan</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Surat</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {suratList.map((surat) => (
                            <tr key={surat.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{surat.jenisSurat || 'Umum'}</td>
                                <td 
                                    className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold cursor-pointer hover:underline"
                                    onClick={() => handlePreviewClick(surat)}
                                >
                                    {getNamaForDisplay(surat)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(surat.createdAt).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(surat.status)}`}>
                                        {surat.status || 'Belum Selesai'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleUpdateClick(surat)} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                                        Ubah Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedSurat && (
                <SuratPreviewModal 
                    surat={selectedSurat} 
                    onClose={handleCloseModals} 
                    onDownloadPDF={() => startDownload('pdf')}
                    onDownloadJPEG={() => startDownload('jpeg')}
                />
            )}
            {suratToUpdate && <UpdateStatusModal surat={suratToUpdate} onClose={handleCloseModals} />}
        </>
    );
}
