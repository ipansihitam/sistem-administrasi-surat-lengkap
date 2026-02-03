'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqItems = [
    { question: 'Bagaimana cara menambah data penduduk baru?', answer: 'Masuk ke menu Surat yang diinginkan, klik Tambah Data, isi seluruh data wajib lalu simpan, dan sistem akan otomatis memproses surat terdaftar.' },
    { question: 'Bagaimana cara memverifikasi pengajuan surat dari warga?', answer: 'Buka menu Pengajuan Terkini, pilih pengajuan yang menunggu verifikasi, periksa kelengkapan data, lalu ubah status menjadi diproses atau ditolak.' },
    { question: 'Bagaimana cara mengelola surat masuk dan keluar non-warga?', answer: 'Gunakan menu "Surat Masuk/Keluar". Di sana Anda bisa mencatat semua surat dinas atau surat lain yang tidak terkait langsung dengan permohonan warga, lengkap dengan nomor, tanggal, dan perihalnya.' },
    { question: 'Bagaimana cara melihat dan mengekspor laporan surat?', answer: 'Masuk ke Menu Surat, cari periode dan jenis surat yang sesuai, tampilkan data, lalu ekspor ke JPEG atau PDF.' },
];

function FaqItem({ item, index }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200 animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms`, opacity: 0 }} // Opacity 0 to let animation handle it
        >
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center text-left py-5 px-6 focus:outline-none"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-medium text-gray-800">{item.question}</span>
                <ChevronDown className={`h-6 w-6 text-gray-500 transition-transform duration-300 transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            <div 
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="pb-5 px-6 pr-10">
                        <p className="text-gray-600">{item.answer}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FaqSection() {
    return (
        <section className="py-20">
             <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-extrabold text-gray-900">Ada Pertanyaan?</h2>
                <p className="mt-4 text-lg text-gray-500">Temukan jawaban cepat untuk pertanyaan umum tentang penggunaan sistem administrasi desa.</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
                {faqItems.map((item, index) => <FaqItem key={index} item={item} index={index} />)}
            </div>
        </section>
    );
}
