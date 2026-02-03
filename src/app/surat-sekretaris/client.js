'use client';

import React, { useState, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

// Komponen input di dalam tabel, tidak ada perubahan.
const TableInput = ({ value, onChange, placeholder }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-full p-2 bg-transparent border-none resize-none focus:ring-0 focus:outline-none"
        rows={3}
    />
);

// Komponen cetak dengan CSS untuk text wrapping.
const PrintableComponent = React.forwardRef(({ rows, tahun }, ref) => {
    return (
        <div ref={ref} className="printable-area bg-white p-[15mm]">
            <style type="text/css">
                {`
                    .printable-area { 
                        font-family: 'Times New Roman', serif !important; 
                        color: black !important; 
                        background-color: white !important; 
                        -webkit-print-color-adjust: exact !important; 
                    }
                    .print-header { text-align: center !important; margin-bottom: 24px !important; }
                    .print-header h2, .print-header h3 { margin: 0 !important; font-weight: bold !important; }
                    .print-table { width: 100% !important; border-collapse: collapse !important; table-layout: fixed !important; }
                    .print-table th, .print-table td { 
                        border: 1px solid black !important; 
                        padding: 8px !important; 
                        text-align: center !important; 
                        vertical-align: top !important;
                        white-space: normal !important; 
                        word-wrap: break-word !important; 
                    }
                    .print-table th { font-weight: bold !important; }
                    .print-table .header-top th { 
                        border-bottom: 1px solid black !important; 
                    }
                    .print-table .header-bottom th { border-top: none !important; font-weight: normal !important; }
                `}
            </style>
            <div className="print-header">
                <h2 className="text-xl font-bold">BUKU DATA KEPUTUSAN KEPALA DESA</h2>
                <h3 className="text-lg font-bold">TAHUN {tahun}</h3>
            </div>
            <table className="w-full border-collapse border border-slate-400 print-table">
                <thead>
                    <tr className="header-top">
                        <th style={{width: '5%'}}>NO</th>
                        <th style={{width: '25%'}}>NOMOR DAN TANGGAL KEPUTUSAN KEPALA DESA</th>
                        <th style={{width: '20%'}}>TENTANG</th>
                        <th style={{width: '20%'}}>URAIAN SINGKAT</th>
                        <th style={{width: '20%'}}>NOMOR DAN TANGGAL DILAPORKAN</th>
                        <th style={{width: '10%'}}>KETERANGAN</th>
                    </tr>
                    <tr className="header-bottom">
                        <th>(1)</th>
                        <th>(2)</th>
                        <th>(3)</th>
                        <th>(4)</th>
                        <th>(5)</th>
                        <th>(6)</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.id}>
                            <td className="text-center">{index + 1}</td>
                            <td>{row.noTglKeputusan}</td>
                            <td>{row.tentang}</td>
                            <td>{row.uraian}</td>
                            <td>{row.noTglLapor}</td>
                            <td>{row.keterangan}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});
PrintableComponent.displayName = 'PrintableComponent';


export default function SuratSekretarisClient({ suratMasuk }) {
    const [tahun, setTahun] = useState(new Date().getFullYear());
    const [rows, setRows] = useState([
        { id: 1, noTglKeputusan: '', tentang: '', uraian: '', noTglLapor: '', keterangan: '' },
    ]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const componentToPrintRef = useRef(null);

    const handleDownloadJpeg = () => {
        const element = componentToPrintRef.current;
        if (!element) return;

        element.style.width = `297mm`;
        element.style.height = `210mm`;
        element.style.display = 'block';

        toJpeg(element, { quality: 1.0, backgroundColor: 'white', pixelRatio: 2 })
            .then(dataUrl => {
                const link = document.createElement('a');
                link.download = `Buku Data Keputusan Kepala Desa - Tahun ${tahun}.jpeg`;
                link.href = dataUrl;
                link.click();
                element.style.width = null;
                element.style.height = null;
                element.style.display = null;
            });
        setIsDropdownOpen(false); 
    }

    const handleDownloadPdf = () => {
        const element = componentToPrintRef.current;
        if (!element) return;

        const pdfWidth = 297;
        const pdfHeight = 210;

        element.style.width = `${pdfWidth}mm`;
        element.style.height = `${pdfHeight}mm`;
        element.style.display = 'block';

        toJpeg(element, { 
            quality: 1.0, 
            backgroundColor: 'white', 
            pixelRatio: 3, 
            canvasWidth: pdfWidth * 3,
            canvasHeight: pdfHeight * 3,
         })
            .then(dataUrl => {
                const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
                pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Buku Data Keputusan Kepala Desa - Tahun ${tahun}.pdf`);
                element.style.width = null;
                element.style.height = null;
                element.style.display = null;
            });

        setIsDropdownOpen(false);
    }

    const handleAddRow = () => {
        setRows(prevRows => [
            ...prevRows,
            { id: Date.now(), noTglKeputusan: '', tentang: '', uraian: '', noTglLapor: '', keterangan: '' },
        ]);
    };

    const handleRemoveRow = (id) => {
        setRows(prevRows => prevRows.filter(row => row.id !== id));
    };

    const handleRowChange = (id, field, value) => {
        setRows(prevRows =>
            prevRows.map(row => (row.id === id ? { ...row, [field]: value } : row))
        );
    };

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            
            <div style={{ position: 'fixed', left: '-3000px', top: 0, zIndex: -1 }}>
                <PrintableComponent ref={componentToPrintRef} rows={rows} tahun={tahun} />
            </div>

            <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900">Buku Data Keputusan Kepala Desa</h1>
                     <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-600">TAHUN:</span>
                        <input 
                            type="number" 
                            value={tahun}
                            onChange={(e) => setTahun(e.target.value)} 
                            className="w-24 p-2 text-center font-bold bg-slate-100 rounded-md"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleAddRow}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                        >
                            + Tambah Baris
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
                            >
                                Download
                                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                    <button
                                        onClick={handleDownloadPdf}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Download PDF
                                    </button>
                                    <button
                                        onClick={handleDownloadJpeg}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Download JPEG
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-400 min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="border border-slate-300 p-2 w-12">NO</th>
                                <th className="border border-slate-300 p-2">NOMOR DAN TANGGAL KEPUTUSAN KEPALA DESA</th>
                                <th className="border border-slate-300 p-2">TENTANG</th>
                                <th className="border border-slate-300 p-2">URAIAN SINGKAT</th>
                                <th className="border border-slate-300 p-2">NOMOR DAN TANGGAL DILAPORKAN</th>
                                <th className="border border-slate-300 p-2">KETERANGAN</th>
                                <th className="border border-slate-300 p-2 w-20">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.id}>
                                    <td className="border border-slate-300 p-2 text-center align-top">{index + 1}</td>
                                    <td className="border border-slate-300"><TableInput placeholder="(INPUT TEKS)" value={row.noTglKeputusan} onChange={(e) => handleRowChange(row.id, 'noTglKeputusan', e.target.value)} /></td>
                                    <td className="border border-slate-300"><TableInput placeholder="(INPUT TEKS)" value={row.tentang} onChange={(e) => handleRowChange(row.id, 'tentang', e.target.value)} /></td>
                                    <td className="border border-slate-300"><TableInput placeholder="(INPUT TEKS)" value={row.uraian} onChange={(e) => handleRowChange(row.id, 'uraian', e.target.value)} /></td>
                                    <td className="border border-slate-300"><TableInput placeholder="(INPUT TEKS)" value={row.noTglLapor} onChange={(e) => handleRowChange(row.id, 'noTglLapor', e.target.value)} /></td>
                                    <td className="border border-slate-300"><TableInput placeholder="(INPUT TEKS)" value={row.keterangan} onChange={(e) => handleRowChange(row.id, 'keterangan', e.target.value)} /></td>
                                    <td className="border border-slate-300 text-center align-top">
                                        <button onClick={() => handleRemoveRow(row.id)} className="text-red-500 hover:text-red-700 font-bold text-sm p-2">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
