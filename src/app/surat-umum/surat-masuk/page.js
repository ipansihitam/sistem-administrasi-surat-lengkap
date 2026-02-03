'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createSuratUmum } from '../actions';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const initialState = {
    success: false,
    message: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-400 transition-colors">
            {pending ? 'Menyimpan...' : 'Simpan Surat'}
        </button>
    );
}

export default function SuratMasukForm() {
    const [state, formAction] = useFormState(createSuratUmum, initialState);
    const formRef = useRef(null);

    useEffect(() => {
        if (state.success) {
            alert(state.message); 
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-md border border-gray-200">
                 <div className="mb-6">
                    <Link href="/layanan/surat-umum" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                        <ArrowLeft size={16} />
                        <span>Kembali</span>
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-slate-800 text-center">Input Surat Masuk</h1>
                <p className="text-center text-slate-600 mb-8">Lengkapi formulir di bawah untuk mencatat surat masuk.</p>

                {/* --- PERBAIKAN: Menampilkan pesan error multi-baris --- */}
                {state.message && !state.success && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        {state.message.split('\n').map((line, i) => (
                            <span key={i} className="block">{line}</span>
                        ))}
                    </div>
                )}

                <form ref={formRef} action={formAction} className="space-y-6">
                    <input type="hidden" name="jenisSurat" value="Surat Masuk" />
                    <div>
                        <label htmlFor="nomorSurat" className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat</label>
                        <input type="text" id="nomorSurat" name="nomorSurat" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="tanggalSurat" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Surat</label>
                        <input type="date" id="tanggalSurat" name="tanggalSurat" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="pengirim" className="block text-sm font-medium text-gray-700 mb-1">Pengirim</label>
                        <input type="text" id="pengirim" name="pengirim" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="perihal" className="block text-sm font-medium text-gray-700 mb-1">Perihal</label>
                        <textarea id="perihal" name="perihal" rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <div className="flex justify-end items-center gap-4 pt-4">
                        <Link href="/layanan/surat-umum" className="text-sm font-medium text-gray-600 hover:text-gray-800">Batal</Link>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
