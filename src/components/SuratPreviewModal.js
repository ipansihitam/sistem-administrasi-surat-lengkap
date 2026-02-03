'use client';

import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SuratUmumTemplate from '../app/surat-umum/SuratUmumTemplate';
import FormulirKelahiranTemplate from '../app/kelahiran/FormulirKelahiranTemplate';
import FormulirKematianTemplate from '../app/kematian/FormulirKematianTemplate';
import FormulirPindahTemplate from '../app/pindah-wni/FormulirPindahTemplate';

const SuratPreviewModal = ({ surat, onClose }) => {
    const contentRef = useRef(null);

    const handleDownloadPDF = async () => {
        const element = contentRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${surat.jenisSurat}_${surat.nama || 'surat'}.pdf`);
    };

    const handleDownloadJPEG = async () => {
        const element = contentRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.download = `${surat.jenisSurat}_${surat.nama || 'surat'}.jpeg`;
        link.click();
    };

    const getSuratTemplate = () => {
        // Always pass the entire surat object to the templates
        switch (surat.jenisSurat) {
            case 'Kelahiran':
                return <FormulirKelahiranTemplate surat={surat} />;
            case 'Kematian':
                return <FormulirKematianTemplate surat={surat} />;
            case 'Pindah WNI':
                return <FormulirPindahTemplate surat={surat} />;
            case 'keterangan':
            case 'pengantar':
            case 'usaha':
            case 'tidak_mampu':
            default:
                return <SuratUmumTemplate surat={surat} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Pratinjau Surat</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="overflow-y-auto flex-grow p-4 sm:p-6">
                     <div ref={contentRef} className="bg-white text-gray-900">
                        {getSuratTemplate()}
                    </div>
                </div>

                <div className="p-4 sm:p-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3">
                    <button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        Download PDF
                    </button>
                    <button onClick={handleDownloadJPEG} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        Download JPEG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuratPreviewModal;
