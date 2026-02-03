'use client';

import { useActionState, useTransition, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveSuratUmum } from './actions';
import Link from 'next/link';

const initialState = {
    message: null,
    status: null,
};

export default function InputSuratUmumClient({ initialData = {} }) {
    const [state, formAction] = useActionState(saveSuratUmum, initialState);
    const [isPending, startTransition] = useTransition();
    
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');
    const isEditMode = !!initialData.id;

    const [jenisSurat, setJenisSurat] = useState(initialData.jenisSurat || '');

    useEffect(() => {
        if (!isEditMode) {
            if (typeParam === 'masuk') {
                setJenisSurat('Surat Masuk');
            } else if (typeParam === 'keluar') {
                setJenisSurat('Surat Keluar');
            }
        }
    }, [typeParam, isEditMode]);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        startTransition(() => {
            formAction(formData);
        });
    };

    const pageTitle = isEditMode 
        ? `Edit ${initialData.jenisSurat}` 
        : jenisSurat === 'Surat Masuk' 
        ? 'Input Surat Masuk' 
        : 'Buat Surat Keluar';
        
    const pageDescription = isEditMode
        ? `Perbarui detail untuk nomor surat: ${initialData.nomorSurat}`
        : `Lengkapi formulir di bawah untuk mencatat ${jenisSurat.toLowerCase()}.`;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">{pageTitle}</h2>
                    <p className="mt-2 text-center text-sm text-slate-600">{pageDescription}</p>
                </div>

                {state?.message && (
                     <div className={`p-4 rounded-md ${state.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        <p>{state.message}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
                    {isEditMode && <input type="hidden" name="id" value={initialData.id} />}

                    <input type="hidden" name="jenisSurat" value={jenisSurat} />

                    <div>
                        <label htmlFor="nomorSurat" className="block text-sm font-medium text-slate-700">Nomor Surat</label>
                        <input id="nomorSurat" name="nomorSurat" type="text" defaultValue={initialData.nomorSurat || ''} required placeholder="Masukkan nomor surat lengkap" className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                    </div>

                    <div>
                        <label htmlFor="tanggalSurat" className="block text-sm font-medium text-slate-700">Tanggal Surat</label>
                        <input id="tanggalSurat" name="tanggalSurat" type="date" defaultValue={initialData.tanggalSurat || ''} required className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                    </div>

                    {jenisSurat === 'Surat Masuk' && (
                        <div>
                            <label htmlFor="pengirim" className="block text-sm font-medium text-slate-700">Pengirim</label>
                            <input id="pengirim" name="pengirim" type="text" defaultValue={initialData.pengirim || ''} required placeholder="Lembaga atau perorangan yang mengirim" className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                        </div>
                    )}

                    {jenisSurat === 'Surat Keluar' && (
                        <div>
                            <label htmlFor="tujuan" className="block text-sm font-medium text-slate-700">Tujuan</label>
                            <input id="tujuan" name="tujuan" type="text" defaultValue={initialData.tujuan || ''} required placeholder="Lembaga atau perorangan yang dituju" className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                        </div>
                    )}
                    
                     <div>
                        {/* --- PERBAIKAN: Memperbaiki tag penutup yang salah --- */}
                        <label htmlFor="perihal" className="block text-sm font-medium text-slate-700">Perihal</label>
                        <textarea id="perihal" name="perihal" rows="3" defaultValue={initialData.perihal || ''} required placeholder="Subjek atau inti dari isi surat" className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href="/surat-umum/arsip" className="inline-flex justify-center py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending || !jenisSurat}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                            {isPending ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan Surat'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
